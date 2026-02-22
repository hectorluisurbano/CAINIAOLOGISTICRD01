# Sistema de Auditoría Inmutable - CAINAO SHIPPING

Este documento describe la arquitectura y el diseño del sistema de auditoría empresarial, garantizando la trazabilidad, inmutabilidad y transparencia de cada acción relevante en la plataforma.

## 1. Arquitectura de Inmutabilidad
La inmutabilidad de los registros de auditoría se garantiza mediante una estrategia multi-capa:

- **Capa de Aplicación**: El `AuditService` solo expone métodos para la creación y lectura de logs. No existen métodos de actualización (`update`) o eliminación (`delete`).
- **Capa de Base de Datos**:
    - Se recomienda el uso de un usuario de base de datos específico para la aplicación que solo tenga permisos de `INSERT` y `SELECT` sobre la tabla `audit_logs`.
    - Uso de **PostgreSQL Triggers** para prevenir cualquier intento de `UPDATE` o `DELETE` sobre registros existentes:
      ```sql
      CREATE RULE no_update_audit AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
      CREATE RULE no_delete_audit AS ON DELETE TO audit_logs DO INSTEAD NOTHING;
      ```
- **Integridad**: Cada log incluye un `traceId` para agrupar acciones relacionadas a través de múltiples servicios.

## 2. Niveles de Severidad
Se definen cinco niveles de severidad para clasificar la importancia de los eventos:

1.  **INFO**: Acciones rutinarias (ej. inicio de sesión, creación de envío).
2.  **WARNING**: Anomalías no críticas (ej. intentos de pago fallidos, cambio de contraseña).
3.  **ERROR**: Fallos funcionales (ej. error en integración de API externa).
4.  **CRITICAL**: Fallos del sistema o financieros (ej. discrepancia en ledger).
5.  **SECURITY**: Acciones que comprometen la integridad (ej. escalada de privilegios, acceso denegado repetitivo).

## 3. Modelo de Datos y Metadata
La tabla `audit_logs` utiliza el tipo `JSONB` para almacenar metadata flexible:

- **Metadata Base**:
    - `ipAddress`: Origen de la solicitud.
    - `userAgent`: Dispositivo/Navegador.
    - `timestamp`: Momento exacto de la acción.
- **Contexto de Acción**:
    - `entity`: Tabla o modelo afectado (User, Shipment, etc.).
    - `entityId`: Identificador del registro.
    - `oldValue` / `newValue`: Snapshot de los datos antes y después (diff).

## 4. Control de Visibilidad por Rol
El acceso a los logs está restringido mediante **RBAC**:

| Rol | Alcance de Visibilidad |
| :--- | :--- |
| **USER** | Solo logs donde `userId` coincida con su ID (solo sus acciones). |
| **AGENT** | Logs de sus acciones y las acciones de sus clientes asignados. |
| **ADMIN** | Acceso total a todos los logs del sistema. |

## 5. Estrategia de Exportación
El sistema permite la exportación de logs filtrados en formatos estándar:
- **JSON**: Para integración con herramientas externas de SIEM (Security Information and Event Management).
- **CSV**: Para auditorías manuales y reportes de cumplimiento.

## 6. Integración con el EventBus
El sistema de auditoría es **pasivo** y **reactivo**. Cada vez que un módulo publica un evento en el `EventBus`, un suscriptor global captura el evento y lo persiste como un rastro de auditoría sin intervenir en el flujo principal del negocio.
