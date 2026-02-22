# Documentación Técnica Integral - CAINAO SHIPPING

Este documento proporciona una visión global y detallada de la plataforma CAINAO SHIPPING, diseñada para optimizar la logística internacional entre la República Dominicana y China.

---

## 1. Arquitectura del Sistema
La plataforma está construida bajo una arquitectura de **Monolito Modular**, lo que permite una separación clara de dominios de negocio mientras mantiene la simplicidad operativa.

### Diagrama Conceptual de Capas:
```text
[ Capa de Presentación ]  <-- Next.js 15 (App Router + Server Actions)
          |
[ Capa de Aplicación  ]  <-- Servicios de Dominio (Shipping, Wallet, etc.)
          |
[ Capa de Dominio      ]  <-- Entidades, Agregados y Eventos de Dominio
          |
[ Capa de Infraestructura] <-- Prisma ORM, PostgreSQL, AWS S3, EventBus
```

---

## 2. Modelo Financiero: Billetera y Ledger
Garantiza la consistencia atómica de los fondos mediante contabilidad de partida doble.

### Flujo de Transacción Atómica:
```text
Usuario A -> [ JournalEntry ] -> { LedgerEntry(Débito, Cuenta A), LedgerEntry(Crédito, Cuenta B) }
```
- **Invariante**: La suma de los LedgerEntries de un JournalEntry es siempre 0.
- **Hold (Escrow)**: Bloqueo temporal de fondos para servicios de importación offshore.

---

## 3. Motor de Envíos y Ciclo de Vida
Maneja el transporte internacional mediante una máquina de estados formal.

### Ciclo de Vida del Envío:
```text
DRAFT -> PENDING -> RECEIVED_CHINA -> IN_TRANSIT -> CUSTOMS_HOLD -> CUSTOMS_CLEARED -> ARRIVED_RD -> DELIVERED
```
- **Peso Volumétrico**: Calculado automáticamente para optimizar costos de carga aérea vs marítima.
- **Trazabilidad**: Cada cambio de estado genera un rastro inmutable en `TrackingHistory`.

---

## 4. Flujo Offshore (Importación Asistida)
Proceso de 6 pasos para compras directas en China (1688, Wiyu).

1.  **Sourcing**: Links de proveedores.
2.  **Quotation**: Validación de precios por agentes.
3.  **Escrow**: Fondos bloqueados en la billetera.
4.  **QC**: Inspección física en China con fotos.
5.  **Consolidation**: Agrupación por lotes/contenedores.
6.  **Shipping**: Despacho internacional.

---

## 5. Seguridad y Control de Acceso (RBAC)
- **Identidad**: JWT stateless con Refresh Tokens.
- **Permisos**:
    - `USER`: Operaciones personales.
    - `AGENT`: Gestión de cartera de clientes y almacén.
    - `ADMIN`: Control total y auditoría global.

---

## 6. Auditoría e Inmutabilidad
Cada acción crítica publica un evento al `EventBus`, el cual es capturado por el `AuditService` para su registro permanente.

- **Severidades**: INFO, WARNING, ERROR, CRITICAL, SECURITY.
- **Protección**: Triggers a nivel de DB previenen la edición/eliminación de logs.

---

## 7. Modelo de Datos (Prisma)
- **PostgreSQL**: Motor relacional robusto.
- **JSONB**: Utilizado para dimensiones de paquetes, metadata de auditoría y fotos.
- **Indexing**: Optimizado para búsquedas por `trackingId`, `sku` y `userId`.

---

## 8. Escalabilidad e IA Ready
- **Modularidad**: Preparado para extraer módulos a microservicios.
- **IA**: Arquitectura lista para integrar modelos de predicción de tiempos y clasificación de carga basada en imágenes de QC.
