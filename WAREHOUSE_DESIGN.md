# Diseño del Módulo de Warehouse (Almacén Virtual) - CAINAO SHIPPING

Este documento detalla el diseño técnico y funcional del almacén virtual, enfocado en la consolidación logística, trazabilidad y gestión de inventario.

## 1. Modelo de Datos y Entidades
El sistema gestiona artículos desde su recepción hasta su conversión en envíos finales.

- **WarehouseItem**: Entidad principal que representa un artículo físico.
    - `sku`: Identificador único automático.
    - `batchId`: Referencia al lote para trazabilidad.
    - `expiryDate`: Fecha de vencimiento para productos perecederos o sensibles.
    - `status`: Estado actual (RECEIVED, CONSOLIDATED, SHIPPED).
- **Batch (Lote)**: Agrupación de artículos recibidos en una misma operación para seguimiento de origen.
- **Container (Contenedor)**: Soporte para consolidación masiva.
    - **LCL (Less than Container Load)**: Carga consolidada de múltiples usuarios.
    - **FCL (Full Container Load)**: Contenedor exclusivo para un solo cliente o proyecto.
- **StoragePenalty**: Registro de penalizaciones por exceder el tiempo de almacenamiento gratuito (ej. > 30 días).

## 2. Reglas de Negocio
- **SKU Automático**: Al recibir mercancía, el sistema genera un SKU único siguiendo el patrón: `CN-YYYYMMDD-XXXX` (Donde XXXX es un correlativo).
- **Consolidación**: Los artículos en estado `RECEIVED` pueden ser agrupados en un solo `Shipment`. Al consolidar, el `availableBalance` de la cuenta del usuario debe cubrir los costos de manejo.
- **Control de Vencimiento**: Alertas automáticas 15 días antes del `expiryDate`. Bloqueo de envío si el producto está vencido.
- **Penalización por Almacenamiento**:
    - Período de gracia: 30 días (configurable por nivel de gamificación).
    - Tarifa diaria tras gracia: $0.50 por lb/día (ejemplo).
- **Conversión Warehouse → Shipment**: Al convertir, se pre-rellenan los datos de peso y dimensiones capturados en la recepción inicial.

## 3. Estados del Artículo
| Estado | Descripción |
| :--- | :--- |
| `PENDING_RECEIPT` | Notificado por el usuario pero no llegado al almacén. |
| `RECEIVED` | En almacén, con fotos y medidas validadas. |
| `CONSOLIDATED` | Asignado a un envío pendiente de despacho. |
| `SHIPPED` | Fuera del almacén, en tránsito internacional. |
| `DISCARDED` | Eliminado por vencimiento o daño. |

## 4. Eventos Críticos
- `ItemReceived`: Dispara la generación de SKU y notificación al usuario.
- `StorageLimitExceeded`: Genera un débito automático o bloqueo por penalización.
- `ItemConsolidated`: Cambia el estado de múltiples artículos y los vincula a un `ShipmentId`.
- `ExpiryAlert`: Notifica al cliente sobre mercancía próxima a vencer.

## 5. Trazabilidad por Lote
Cada `WarehouseItem` mantiene un rastro inmutable de su `batchId`. Esto permite realizar un "recall" o seguimiento completo si se detecta un problema con un cargamento específico desde China.
