# CAINAO SHIPPING

**CAINAO SHIPPING** es una plataforma integral de **gestión logística nacional e internacional**, diseñada específicamente para optimizar y simplificar el comercio entre la **República Dominicana y China**. La solución abarca desde la gestión de paquetería básica hasta procesos complejos de importación offshore, consolidación de carga e inspección de calidad (QC).

## Propósito y Público Objetivo
El sistema tiene como visión centralizar las operaciones logísticas en una arquitectura segura y escalable, eliminando la complejidad de los procesos manuales mediante herramientas de **cotización en tiempo real y gestión de almacén virtual**. Está dirigida a tres tipos de usuarios:
*   **Usuario Común (USER):** Realiza pedidos, paga envíos y rastrea su estado.
*   **Agente de Compra (AGENT/PRO):** Gestiona clientes asignados, realiza consolidación de pedidos y operaciones de almacén.
*   **Administrador (ADMIN):** Posee control total del sistema, incluyendo gestión de usuarios, pagos y generación de reportes.

## Módulos y Funcionalidades Principales
1.  **Dashboard Interactivo:** Centro de control que muestra métricas clave como envíos activos, entregas completadas y saldo disponible en la billetera.
2.  **Gestión de Envíos:** Permite la creación de guías mediante un **formulario de 5 pasos** que incluye cálculo automático de costos (basado en peso real o volumétrico), selección de servicio (Standard vs Express) y generación de un `trackingId` único.
3.  **Servicios Offshore:** Flujo guiado de **6 pasos** para gestionar importaciones desde China, cubriendo desde la información del producto y link del proveedor (1688/Wiyu) hasta la inspección de calidad (QC) y declaración de aduanas.
4.  **Almacén Virtual:** Control de inventario antes del envío final. Los usuarios pueden visualizar sus artículos con fotos, pesos y dimensiones, y convertirlos directamente en un envío pre-rellenando los datos.
5.  **Billetera y Facturación:** Sistema financiero integrado para recargas de saldo y pagos de servicios de forma transaccional, asegurando la consistencia de fondos.
6.  **Módulo de Logs y Auditoría:** Registra todas las actividades de la plataforma (40+ tipos de acciones) con niveles de visibilidad diferenciados según el rol del usuario para garantizar la transparencia.

## Infraestructura y Tecnologías Clave
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
