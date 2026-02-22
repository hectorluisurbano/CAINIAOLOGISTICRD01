# Motor de Gestión de Envíos - CAINAO SHIPPING

Este documento detalla el diseño técnico del motor de gestión de envíos, encargado de orquestar el ciclo de vida de los paquetes, las validaciones de estado y el cálculo de costos.

## 1. Máquina de Estados Formal
El ciclo de vida de un envío se rige por una máquina de estados estricta para garantizar la integridad operativa.

| Estado | Descripción |
| :--- | :--- |
| `DRAFT` | Guía creada pero no confirmada por el usuario. |
| `PENDING` | Guía confirmada, esperando recepción del paquete. |
| `RECEIVED_CHINA` | Paquete recibido y procesado en el almacén de China. |
| `IN_TRANSIT` | En transporte internacional (Marítimo o Aéreo). |
| `CUSTOMS_HOLD` | Retenido en aduanas para inspección o documentación. |
| `CUSTOMS_CLEARED` | Proceso aduanal completado exitosamente. |
| `ARRIVED_RD` | Paquete en el almacén local de República Dominicana. |
| `OUT_FOR_DELIVERY` | En ruta de entrega final al cliente. |
| `DELIVERED` | Entrega confirmada. |
| `CANCELLED` | Envío anulado. |

## 2. Eventos y Reglas de Transición
Las transiciones solo pueden ocurrir a través de eventos validados.

| De Estado | Evento | A Estado | Validaciones / Reglas |
| :--- | :--- | :--- | :--- |
| `DRAFT` | `CONFIRM` | `PENDING` | Datos del remitente/destinatario completos. |
| `PENDING` | `RECEIVE` | `RECEIVED_CHINA` | Registro de peso y dimensiones reales. |
| `RECEIVED_CHINA` | `SHIP` | `IN_TRANSIT` | Pago confirmado o crédito disponible. |
| `IN_TRANSIT` | `HOLD` | `CUSTOMS_HOLD` | Notificación de discrepancia aduanal. |
| `CUSTOMS_HOLD` | `CLEAR` | `CUSTOMS_CLEARED` | Pago de aranceles o documentación aprobada. |
| `IN_TRANSIT` | `ARRIVE` | `ARRIVED_RD` | Escaneo en puerto/almacén local. |
| `CUSTOMS_CLEARED` | `ARRIVE` | `ARRIVED_RD` | Transición automática tras despacho. |
| `ARRIVED_RD` | `DISPATCH` | `OUT_FOR_DELIVERY` | Asignación de mensajero/vehículo. |
| `OUT_FOR_DELIVERY` | `DELIVER` | `DELIVERED` | Firma de recibido o prueba de entrega. |
| `*` | `CANCEL` | `CANCELLED` | Solo si no ha sido entregado. |

## 3. Cálculo Dinámico de Costos
El costo se calcula en tiempo real basándose en el tipo de servicio y las dimensiones.

### Peso Volumétrico
Se aplica la fórmula estándar de la industria:
`Peso Volumétrico (lb) = (Largo * Ancho * Alto) / Factor`
- **Factor Aéreo**: 166 (pulgadas) o 6000 (cm).
- **Factor Marítimo**: Se basa en pies cúbicos (CFT).

### Costo Final
`Costo = Máximo(Peso Real, Peso Volumétrico) * Tarifa_Servicio + Gastos_Aduanales + Seguro`

## 4. Estrategia de Trazabilidad
Cada cambio de estado genera un rastro de auditoría inmutable:
- **TrackingHistory**: Tabla que registra `timestamp`, `from_status`, `to_status`, `actor_id` y `location`.
- **External API Sync**: Sincronización con transportistas (DHL, UPS, etc.) que inyecta eventos externos al historial local.
- **Pruebas de Entrega**: Almacenamiento de firmas digitales y fotos de entrega en S3 vinculadas al evento `DELIVER`.

## 5. Manejo de Excepciones
- **Deadlock de Estado**: Si un envío queda en un estado inconsistente, solo un `ADMIN` puede forzar una transición correctiva previa justificación.
- **Fallo de API**: Los fallos en la comunicación con APIs externas se manejan mediante reintentos exponenciales (Exponential Backoff).
- **Discrepancia de Peso**: Si el peso reportado por el transportista difiere significativamente del registrado en almacén, el envío se mueve a `CUSTOMS_HOLD` automáticamente para revisión.
