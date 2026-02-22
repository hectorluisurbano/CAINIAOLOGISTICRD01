# Documentación Técnica Integral - CAINAO SHIPPING

Este documento proporciona una visión global y detallada de la plataforma CAINAO SHIPPING, diseñada para optimizar la logística internacional entre la República Dominicana y China.

---

## 1. Arquitectura del Sistema
La plataforma está construida bajo una arquitectura de **Monolito Modular**, lo que permite una separación clara de dominios de negocio mientras mantiene la simplicidad operativa.

### Capas del Sistema:
- **Presentation**: Next.js 15 (App Router + Server Actions).
- **Application**: Servicios de Dominio que coordinan casos de uso.
- **Domain**: Entidades, Agregados y Eventos de Dominio (DDD).
- **Infrastructure**: Prisma ORM, PostgreSQL, AWS S3, EventBus.

---

## 2. Modelo de Datos y Base de Datos (PostgreSQL)
El diseño de persistencia se enfoca en la integridad, auditoría y escalabilidad.

- **Auditoría Global**: Cada tabla principal cuenta con rastro de cambios (`AuditLog`).
- **Seguridad**: Soft deletes (`deletedAt`) y Control de Concurrencia (`version`).
- **Escalabilidad**: Estrategia de particionamiento para logs y envíos históricos.
- **JSONB**: Utilizado para dimensiones de paquetes, metadata de auditoría y fotos.

---

## 3. Modelo Financiero: Billetera y Ledger
Garantiza la consistencia atómica de los fondos mediante un sistema de **Contabilidad de Partida Doble**.

- **JournalEntry**: Registro de transacciones que afecta a múltiples cuentas.
- **LedgerEntry**: Asientos individuales de crédito/débito.
- **Invariante**: Suma(LedgerEntries) = 0 por transacción.
- **Multi-moneda**: Soporte nativo para USD, DOP y CNY con tasas de cambio históricas.
- **Escrow/Hold**: Bloqueo temporal de fondos para procesos offshore.

---

## 4. Motor de Envíos y Ciclo de Vida
Maneja el transporte internacional mediante una **Máquina de Estados Formal**.

- **Estados Clave**: DRAFT, PENDING, RECEIVED_CHINA, IN_TRANSIT, CUSTOMS, ARRIVED_RD, DELIVERED.
- **Validaciones**: Las transiciones son validadas por `ShippingService`.
- **Peso Volumétrico**: Calculado dinámicamente según el factor de servicio (Aéreo/Marítimo).
- **Trazabilidad**: Historial completo en `TrackingHistory` sincronizable con APIs externas.

---

## 5. Módulo de Warehouse y Consolidación
Gestión de inventario físico y preparación de carga.

- **SKU Automático**: Generación única al momento de la recepción.
- **Consolidación**: Capacidad para agrupar múltiples `WarehouseItems` en un solo `Shipment`.
- **Carga LCL/FCL**: Soporte para carga consolidada y contenedores completos.
- **Almacenamiento**: Control de días de gracia y cálculo automático de penalizaciones por estadía extendida.

---

## 6. Flujo Offshore (Importación Asistida)
Proceso guiado de 6 pasos para mitigar riesgos en compras directas en China.

1.  **Sourcing**: Identificación de productos y links (1688, Wiyu).
2.  **Quotation**: Validación de costos y agentes.
3.  **Payment/Escrow**: Fondos bloqueados en la billetera.
4.  **QC (Quality Control)**: Inspección física con reportes fotográficos.
5.  **Consolidation**: Agrupación logística.
6.  **Shipping**: Despacho internacional y aduanas.

---

## 7. Modelo de Seguridad Enterprise
- **Autenticación**: NextAuth.js con JWT (Access + Refresh Tokens) y bcrypt.
- **Autorización**: RBAC jerárquico (USER -> AGENT -> ADMIN).
- **Protección**: Validación estricta con Zod y mitigación de ataques CSRF/XSS.
- **Auditoría Inmutable**: Logs inalterables protegidos a nivel de base de datos.

---

## 8. Eventos de Dominio y Desacoplamiento
El sistema se comunica internamente mediante un `EventBus` centralizado.
- **Eventos Críticos**: `ShipmentCreated`, `BalanceUpdated`, `QCReportGenerated`, `UserLevelUp`.
- **Integración**: Los eventos disparan acciones secundarias como notificaciones y puntos de gamificación.

---

## 9. Escalabilidad e IA
- **Modularidad**: Diseñado para facilitar la transición a Microservicios.
- **IA Ready**: Infraestructura lista para integrar modelos de predicción de tiempos, optimización de rutas y reconocimiento de imágenes de carga.
