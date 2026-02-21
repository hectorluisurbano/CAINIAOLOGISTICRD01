# Arquitectura de CAINAO SHIPPING

Este documento detalla la arquitectura técnica y el diseño del sistema para la plataforma de gestión logística CAINAO SHIPPING.

## 1. Arquitectura General: Monolito Modular
Se ha seleccionado una arquitectura de **Monolito Modular** para equilibrar la velocidad de desarrollo inicial con una separación clara de responsabilidades. Cada módulo tiene límites definidos, lo que facilita la migración a microservicios en el futuro si la demanda lo requiere.

### Ventajas:
- **Simplicidad de Despliegue**: Una sola unidad de despliegue.
- **Límites Claros**: Los módulos se comunican a través de servicios internos o un bus de eventos.
- **Preparado para el Futuro**: Fácil extracción de módulos pesados (ej. Seguimiento de Envíos) a microservicios independientes.

## 2. Capas del Sistema
El sistema sigue un patrón de diseño por capas para garantizar la mantenibilidad:

- **Capa de Presentación (Presentation)**: Next.js 15 (App Router). Maneja la UI, componentes ShadCN, y Server Actions que actúan como controladores.
- **Capa de Aplicación (Application)**: Servicios que orquestan los casos de uso. No contienen lógica de negocio compleja, sino que coordinan entidades y servicios de infraestructura.
- **Capa de Dominio (Domain)**: El corazón del sistema. Contiene entidades, objetos de valor (Value Objects), interfaces de repositorios y eventos de dominio.
- **Capa de Infraestructura (Infrastructure)**: Implementaciones técnicas como Prisma ORM (PostgreSQL), adaptadores de AWS S3 para almacenamiento de archivos, e integraciones con pasarelas de pago (Stripe/PayPal).

## 3. Separación de Responsabilidades por Módulo

| Módulo | Responsabilidad |
| :--- | :--- |
| **Shipping** | Gestión de guías, cálculo de costos (peso/volumen), tracking y estados. |
| **Warehouse** | Control de inventario en China/RD, fotos de artículos y dimensiones. |
| **Offshore** | Flujo de importación (6 pasos) y comunicación con proveedores chinos. |
| **Wallet** | Ledger financiero, recargas, pagos de servicios y auditoría de fondos. |
| **Gamification** | Sistema de puntos y niveles (Novato -> CEO). |
| **Audit** | Registro centralizado de todas las actividades (40+ tipos de logs). |
| **Identity** | Gestión de usuarios, autenticación y RBAC. |

## 4. Eventos de Dominio Clave
El sistema utiliza eventos para desacoplar módulos:
- `ShipmentCreated`: Notifica al almacén y al sistema de auditoría.
- `PackageArrivedAtWarehouse`: Activa la notificación al usuario y el sistema de puntos.
- `QCReportGenerated`: Envía una alerta al cliente para aprobación.
- `TransactionCompleted`: Actualiza el saldo de la billetera y genera un registro contable.
- `UserLevelUp`: Se dispara cuando un usuario alcanza un umbral de puntos.

## 5. Componentes de Infraestructura
- **Base de Datos**: PostgreSQL para datos estructurados. Uso de `JSONB` para almacenar dimensiones de paquetes y metadatos variables.
- **Almacenamiento**: AWS S3 para fotos de inspección de calidad (QC) y reportes PDF.
- **Autenticación**: NextAuth.js con tokens JWT y control de acceso basado en roles (RBAC).
- **Procesamiento en Segundo Plano**: Preparado para colas de tareas (ej. BullMQ) para generación masiva de PDFs o sincronización con APIs de transporte.

## 6. Escalabilidad Futura
- **Horizontal**: El frontend y backend (Next.js) pueden escalarse horizontalmente detrás de un balanceador de carga.
- **Datos**: Implementación de réplicas de lectura en PostgreSQL para reportes complejos de administración.
- **IA Ready**: La arquitectura modular permite integrar un módulo de **AI/ML** para predicción de tiempos de entrega, optimización de rutas y clasificación automática de paquetes basada en fotos de QC.

## 7. Modelo de Seguridad
- **RBAC (Role-Based Access Control)**:
  - **USER**: Acceso a sus propios envíos, billetera y perfil.
  - **AGENT**: Gestión de clientes asignados y operaciones de almacén.
  - **ADMIN**: Control total, reportes globales y gestión de parámetros del sistema.
- **Validación Estricta**: Uso de **Zod** para validar todos los esquemas de entrada en la API y acciones del servidor.
- **Auditoría**: Cada acción crítica es registrada con el ID del usuario, timestamp y estado anterior/nuevo para transparencia total.
