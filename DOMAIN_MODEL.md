# Modelo de Dominio - CAINAO SHIPPING

Este documento describe el modelado conceptual del sistema siguiendo principios de **Domain-Driven Design (DDD)** para una plataforma de logística internacional.

## 1. Bounded Context: Shipping (Envíos)
Maneja la lógica de transporte internacional, cotizaciones y seguimiento.

- **Aggregates**:
  - **Shipment (Aggregate Root)**: Representa el envío completo.
    - **Entities**: `Package`, `TrackingUpdate`.
    - **Value Objects**: `TrackingId`, `ShippingCost`, `Weight` (Real vs Volumétrico), `Dimensions`, `ServiceType` (Standard/Express).
- **Domain Events**: `ShipmentCreated`, `ShipmentStatusChanged`, `QuotationCalculated`.
- **Invariantes Críticas**:
  - El costo final debe ser el máximo entre el peso real y el volumétrico multiplicado por la tarifa.
  - Un `TrackingId` debe ser único y seguir el formato corporativo.
- **Reglas de Negocio**:
  - El peso volumétrico se calcula como: `(Largo * Ancho * Alto) / Factor_Conversión`.

## 2. Bounded Context: Warehouse (Almacén Virtual)
Gestión de inventario físico y control de calidad (QC).

- **Aggregates**:
  - **WarehouseItem (Aggregate Root)**: Un artículo físico recibido.
    - **Value Objects**: `ItemStatus` (Received, Pending_QC, Ready_for_Shipping), `QCReport`, `Dimensions`.
- **Domain Events**: `ItemReceivedAtWarehouse`, `QCReportGenerated`, `ItemConsolidated`.
- **Invariantes Críticas**:
  - Todo artículo debe tener al menos una foto de inspección antes de pasar a "Ready_for_Shipping".
  - Un artículo solo puede pertenecer a un `Shipment` a la vez.

## 3. Bounded Context: Offshore Import
Flujo especializado para importaciones desde China (1688/Wiyu).

- **Aggregates**:
  - **OffshoreOrder (Aggregate Root)**: Orquesta el proceso de 6 pasos.
    - **Entities**: `SupplierLink`, `CustomsDeclaration`.
    - **Value Objects**: `ImportStep` (Step1_ProductInfo, ..., Step6_Customs).
- **Domain Events**: `OffshoreOrderStarted`, `ImportStepCompleted`, `CustomsDeclarationReady`.
- **Reglas de Negocio**:
  - El flujo es lineal y bloqueante; no se puede avanzar al Paso 4 (QC) sin completar el Paso 3 (Pago al proveedor).

## 4. Bounded Context: Wallet (Billetera)
Sistema financiero transaccional.

- **Aggregates**:
  - **Account (Aggregate Root)**: El saldo y movimientos de un usuario.
    - **Entities**: `Transaction`.
    - **Value Objects**: `Money`, `TransactionType` (Recharge, Payment, Refund).
- **Domain Events**: `BalanceUpdated`, `TransactionFailed`, `LowBalanceAlert`.
- **Invariantes Críticas**:
  - **Consistencia Atómica**: El balance nunca puede ser negativo a menos que sea una cuenta de crédito autorizada.
  - Cada transacción debe tener una contrapartida en el log de auditoría.

## 5. Bounded Context: Gamification
Sistema de fidelidad y niveles.

- **Aggregates**:
  - **LoyaltyProfile (Aggregate Root)**: Puntos y nivel del usuario.
    - **Value Objects**: `Points`, `UserLevel` (Novato, Shipper, Emprendedor, Importador, CEO).
- **Domain Events**: `PointsEarned`, `UserLevelPromoted`.
- **Reglas de Negocio**:
  - Los beneficios del nivel (ej. 30 días de almacén gratis) se aplican automáticamente según el `UserLevel`.

## 6. Bounded Context: Identity & Access (IAM)
Gestión de usuarios y permisos.

- **Aggregates**:
  - **User (Aggregate Root)**: Identidad del sistema.
    - **Value Objects**: `Role` (USER, AGENT, ADMIN), `AuthCredentials`.
- **Invariantes Críticas**:
  - Un usuario solo puede tener un rol principal a la vez.

## 7. Bounded Context: Audit (Auditoría)
Registro de observabilidad y transparencia.

- **Aggregates**:
  - **AuditStream (Aggregate Root)**: Flujo inmutable de acciones.
    - **Value Objects**: `AuditAction`, `Actor`, `Metadata`.

---

## Relaciones entre Contextos (Context Map)
1. **Shipping -> Wallet (Customer/Supplier)**: Shipping solicita un pago a Wallet; Wallet confirma o rechaza la transacción.
2. **Warehouse -> Shipping (Partnership)**: Los artículos de Warehouse se consolidan en Shipments.
3. **Identity -> All (Shared Kernel)**: El concepto de `User` y `Role` es compartido por todos los contextos para autorización.
4. **All -> Audit (Published Language)**: Todos los contextos publican eventos que Audit consume para registro inmutable.
5. **Shipping -> Gamification (Upstream/Downstream)**: Completar un envío otorga puntos al perfil del usuario.
