# Referencia de API y Endpoints - CAINAO SHIPPING

Este documento detalla la estructura de la API, Server Actions y los contratos de datos para los diferentes módulos del sistema.

## 1. Módulo de Envíos (Shipping)

### `POST /api/shipping/transition`
Realiza un cambio de estado validado por la máquina de estados.
- **Body**: `ShipmentUpdatePayload`
    - `shipmentId`: string
    - `toStatus`: ShipmentStatus
    - `location?`: string
    - `description?`: string
    - `metadata?`: object

### `GET /api/shipping/calculate-cost`
Calcula el costo dinámico de un envío.
- **Query Params**: `ShippingCostRequest`
    - `realWeight`: number
    - `l, w, h`: number (dimensiones)
    - `rate`: number

---

## 2. Módulo de Warehouse (Almacén)

### `POST /api/warehouse/receive`
Registra la recepción física de un artículo.
- **Body**: `WarehouseItemReception`
    - `userId`: string
    - `description`: string
    - `photos`: string[]
    - `weight`: number
    - `dimensions`: { l, w, h }

### `POST /api/warehouse/consolidate`
Agrupa artículos para convertirlos en un envío.
- **Body**: `ConsolidationRequest`
    - `userId`: string
    - `itemIds`: string[]

---

## 3. Módulo Offshore (Importación China)

### `POST /api/offshore/orders`
Crea una solicitud de importación asistida.
- **Body**: `OffshoreOrderCreate`
    - `userId`: string
    - `productInfo`: string
    - `urls`: string[]

### `PATCH /api/offshore/transition`
Avanza un pedido offshore a través de los 6 pasos.
- **Body**: `OffshoreTransition`
    - `orderId`: string
    - `toStep`: number (1-6)
    - `toStatus`: OffshoreStatus

---

## 4. Módulo de Billetera (Wallet)

### `POST /api/wallet/transaction`
Ejecuta un movimiento contable de partida doble.
- **Body**: `WalletTransactionRequest`
    - `fromAccountId`: string
    - `toAccountId`: string
    - `amount`: number
    - `idempotencyKey`: string

### `POST /api/wallet/hold`
Bloquea fondos de una cuenta (Escrow).
- **Body**: `HoldRequest`
    - `accountId`: string
    - `amount`: number
    - `reason`: string

---

## 5. Módulo de Auditoría (Audit)

### `GET /api/audit/logs`
Recupera registros de auditoría filtrados por rol.
- **Query Params**: `AuditFilter`
    - `userId?`: string
    - `severity?`: AuditSeverity
    - `startDate?`: Date

### `GET /api/audit/export`
Genera un archivo JSON/CSV de los logs filtrados.

---

## 6. Seguridad y Autenticación
- **Protocolo**: JWT via NextAuth.js.
- **Headers**: `Authorization: Bearer <token>`
- **RBAC**: Los endpoints verifican el rol del usuario (`USER`, `AGENT`, `ADMIN`) antes de procesar la lógica.
- **Idempotencia**: Requerida en todos los endpoints financieros mediante `idempotencyKey`.
