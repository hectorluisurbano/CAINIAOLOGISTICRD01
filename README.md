# CAINAO SHIPPING

**CAINAO SHIPPING** es una plataforma integral de **gestión logística nacional e internacional**, diseñada específicamente para optimizar y simplificar el comercio entre la **República Dominicana y China**. La solución abarca desde la gestión de paquetería básica hasta procesos complejos de importación offshore, consolidación de carga e inspección de calidad (QC).

## Propósito y Público Objetivo
El sistema tiene como visión centralizar las operaciones logísticas en una arquitectura segura y escalable, eliminando la complejidad de los procesos manuales mediante herramientas de **cotización en tiempo real y gestión de almacén virtual**. Está dirigida a tres tipos de usuarios:
*   **Usuario Común (USER):** Realiza pedidos, paga envíos y rastrea su estado.
*   **Agente de Compra (AGENT/PRO):** Gestiona clientes asignados, realiza consolidación de pedidos y operaciones de almacén.
*   **Administrador (ADMIN):** Posee control total del sistema, incluyendo gestión de usuarios, pagos y generación de reportes.

## Módulos y Funcionalidades Principales
Para detalles técnicos profundos, consulta la [Documentación Técnica de Módulos](./docs/TECHNICAL_DOCUMENTATION.md).

1.  [**Gestión de Envíos**](./SHIPPING_ENGINE.md): Motor con máquina de estados, tracking y cálculo volumétrico.
2.  [**Servicios Offshore**](./OFFSHORE_DESIGN.md): Flujo guiado de 6 pasos para importaciones desde China.
3.  [**Almacén Virtual**](./WAREHOUSE_DESIGN.md): Control de inventario, SKU automático y consolidación.
4.  [**Billetera Financiera**](./WALLET_DESIGN.md): Ledger contable de partida doble y multi-moneda.
5.  [**Auditoría Inmutable**](./AUDIT_LOGGING_DESIGN.md): Sistema de logs empresariales con severidad y RBAC.

## Infraestructura y Arquitectura
Consulta el [Diseño de Arquitectura](./ARCHITECTURE.md) y el [Modelo de Datos](./DATABASE_DESIGN.md).

- **Arquitectura**: Monolito Modular con DDD ([Modelo de Dominio](./DOMAIN_MODEL.md)).
- **Backend**: Next.js 15 (App Router), Prisma 7, PostgreSQL.
- **Frontend**: Tailwind CSS 4, ShadCN UI.
- **API**: Consulta la [Referencia de Endpoints](./docs/API_ENDPOINTS.md).

## Tecnologías Clave
La plataforma utiliza un stack moderno orientado a la escalabilidad empresarial:
*   **Frontend Core:** Next.js 15 (App Router) y TypeScript 5.x.
*   **Interfaz (UI/UX):** ShadCN UI + Tailwind CSS. Colores corporativos: Cinnabar (#DD5F3F), Yale Blue (#09366D), Mikado Yellow (#FFC531).
*   **Formularios y Validación:** React Hook Form + Zod.
*   **Gestión de Estado:** Zustand + Context API.
*   **Tablas e Información:** TanStack Table.
*   **Finanzas y Pagos:** Stripe, PayPal, Statrys y Airwallex.
*   **Autenticación y Seguridad:** NextAuth.js v4 + JWT.
*   **Persistencia y ORM:** Prisma 6.x + PostgreSQL.
*   **Infraestructura:** AWS S3, Bun 1.x runtime.

## Sistema de Gamificación
*   **Novato:** Acceso básico.
*   **Shipper:** Cotizaciones rápidas.
*   **Emprendedor:** 30 días de almacén gratuito y asistencia aduanal.
*   **Importador:** Soporte premium y atención preferente.
*   **CEO:** (30,000+ puntos) Servicios gratis, representación aduanal y asistencia 1:1.
