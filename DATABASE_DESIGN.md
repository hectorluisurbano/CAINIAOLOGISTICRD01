# Diseño de Base de Datos - CAINAO SHIPPING (PostgreSQL)

Este documento detalla la arquitectura de persistencia diseñada para soportar una operación logística internacional escalable y auditable.

## 1. Estrategia de Auditoría y Seguimiento de Cambios
Se implementa un modelo de **Auditoría por Tabla** combinado con un **Historial de Cambios** global.

- **Trigger-based Auditing**: Cada tabla principal cuenta con triggers que registran cambios en una tabla de auditoría dedicada.
- **AuditLog**: Tabla central que almacena el `diff` de los cambios en formato JSONB, el usuario que realizó la acción, el timestamp y la dirección IP/User-Agent.
- **Auditable States**: Los cambios de estado (ej. de `RECEIVED_CHINA` a `IN_TRANSIT`) requieren una entrada obligatoria en el historial con el motivo del cambio.

## 2. Integridad y Seguridad de Datos
- **Integridad Referencial**: Uso estricto de Foreign Keys con políticas `ON DELETE RESTRICT` para evitar la orfandad de datos críticos (ej. no se puede borrar un usuario con transacciones).
- **Soft Deletes**: Las tablas principales (Users, Shipments, WarehouseItems) incluyen una columna `deleted_at`. Los registros borrados no se eliminan físicamente sino que se filtran en las consultas de aplicación.
- **Control de Concurrencia**: Uso de **Optimistic Locking** mediante una columna `version` (int) en registros de alta frecuencia de actualización para evitar el "Lost Update problem".

## 3. Diseño del Ledger Financiero (Billetera)
Para garantizar la consistencia de los fondos, se utiliza un modelo de **Contabilidad de Partida Doble**.

- **Accounts**: Representa las cuentas del sistema (Usuario, Operativa, Impuestos, etc.).
- **JournalEntries (Ledger)**: Tabla inmutable donde cada transacción genera al menos dos asientos (débito y crédito).
- **Multi-moneda**: Soporte para USD, DOP y CNY. Cada transacción almacena el monto original, la moneda y la tasa de cambio aplicada en el momento de la operación.
- **Invariante**: La suma de todos los movimientos en el ledger para una cuenta debe ser igual al balance actual almacenado en la tabla `Accounts`.

## 4. Estructura de Tablas Principales

| Tabla | Propósito | Estrategia |
| :--- | :--- | :--- |
| `users` | Perfiles y roles. | Soft delete + Versioning. |
| `shipments` | Guías y tracking. | Particionada por `created_at` (Trimestral). |
| `warehouse_items` | Inventario virtual. | JSONB para dimensiones flexibles. |
| `accounts` | Saldos financieros. | Optimistic Locking. |
| `ledger_entries` | Movimientos contables. | Inmutable + Índices por cuenta y fecha. |
| `audit_logs` | Historial global. | Particionada por mes. |

## 5. Estrategia de Particionado y Escalabilidad
- **Particionamiento**:
  - `audit_logs`: Particionado por rango (Mensual) para facilitar la purga de logs antiguos sin afectar el rendimiento.
  - `shipments`: Particionado por año/trimestre para mantener los índices de búsqueda de tracking rápidos.
- **Indexación Estratégica**:
  - Índices GIN sobre columnas JSONB (`metadata`, `dimensions`).
  - Índices B-Tree compuestos en `(user_id, status)` para dashboards rápidos.
  - Índices parciales para registros activos: `CREATE INDEX idx_active_shipments ON shipments (id) WHERE deleted_at IS NULL`.

## 6. Control de Concurrencia (Ejemplo)
En el módulo de billetera:
```sql
UPDATE accounts
SET balance = balance + :amount, version = version + 1
WHERE id = :id AND version = :current_version;
```
Si el `row_count` es 0, se lanza una excepción de concurrencia y se reintenta la operación.

## 7. Diagrama Conceptual de Relaciones
- `User` 1:N `Account`
- `Account` 1:N `LedgerEntry`
- `User` 1:N `Shipment`
- `Shipment` 1:N `WarehouseItem`
- `User` 1:N `AuditLog`
