# Diseño de Seguridad Enterprise - CAINAO SHIPPING

Este documento detalla el modelo de seguridad, autenticación y autorización de la plataforma, siguiendo estándares de grado empresarial para proteger datos logísticos y financieros.

## 1. Estrategia de Autenticación
La plataforma utiliza **NextAuth.js v4** para gestionar la identidad de forma stateless y segura.

- **Tokens JWT**: Uso de JSON Web Tokens para sesiones.
    - **Access Token**: Token de vida corta (15-30 min) para autorizar solicitudes a la API.
    - **Refresh Token**: Token de vida larga almacenado en cookies `HttpOnly` y `Secure` para renovar el acceso sin requerir re-login.
- **Hashing**: Las contraseñas se almacenan cifradas utilizando **bcrypt** con un factor de costo de 12 (12 rounds).
- **MFA (Multi-Factor Authentication)**: Preparado para integración con proveedores de TOTP o SMS para roles administrativos.

## 2. Modelo de Autorización: RBAC Avanzado
Se implementa un **Control de Acceso Basado en Roles (RBAC)** con jerarquía clara.

### Roles y Alcance:
- **USER (Usuario Común)**:
    - Acceso de lectura/escritura a sus propios envíos, almacén y billetera.
    - No puede ver datos de otros usuarios.
- **AGENT (Agente de Operaciones)**:
    - Hereda permisos de USER.
    - Gestión de almacén (recepción, SKU, QC).
    - Gestión de clientes asignados.
- **ADMIN (Administrador Global)**:
    - Control total del sistema.
    - Gestión de usuarios y roles.
    - Auditoría global y parámetros financieros.

## 3. Seguridad de Datos y API
- **Validación de Esquema**: Uso exhaustivo de **Zod** en todas las entradas (Server Actions y API endpoints) para prevenir ataques de inyección y datos malformados.
- **Inmutabilidad de Auditoría**: Triggers de base de datos impiden la edición o borrado de logs de auditoría críticos.
- **Optimistic Locking**: El campo `version` en entidades financieras previene condiciones de carrera (Race Conditions) y garantiza la integridad del balance.

## 4. Auditoría de Cambios Sensibles
Cada acción que afecte el estado financiero, el rol de un usuario o la configuración del sistema genera automáticamente un `AuditLog` con:
- `traceId` para seguimiento de flujo completo.
- Metadata del dispositivo (IP, User-Agent).
- Snapshots `oldValue` y `newValue` para trazabilidad forense.

## 5. Mitigación de Ataques Comunes
- **XSS**: Sanitización automática por parte de React/Next.js y políticas de seguridad de contenido (CSP).
- **CSRF**: Protección nativa mediante tokens de sincronización manejados por NextAuth.js.
- **SQL Injection**: Uso exclusivo de **Prisma ORM** que utiliza consultas parametrizadas por defecto.
