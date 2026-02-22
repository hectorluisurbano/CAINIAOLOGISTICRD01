# Diseño del Sistema Offshore - CAINAO SHIPPING

Este documento detalla el flujo de importación asistida desde China, un proceso de 6 pasos diseñado para mitigar riesgos y facilitar el comercio entre RD y China.

## 1. Flujo Guiado de 6 Pasos

| Paso | Nombre | Descripción |
| :--- | :--- | :--- |
| **1** | **Información del Producto** | El usuario detalla qué desea importar (categoría, uso, cantidad estimada). |
| **2** | **Links y Proveedores** | Se añaden URLs de 1688, Wiyu o Alibaba. El agente valida la veracidad del proveedor. |
| **3** | **Pago y Escrow** | Se calcula el monto total de compra. El usuario deposita en su billetera y los fondos se **bloquean (Hold)**. |
| **4** | **QC (Quality Control)** | La mercancía llega al centro de consolidación en China. Se toman fotos, se pesa y se verifica calidad vs pedido. |
| **5** | **Consolidación** | Se agrupan múltiples pedidos offshore en un solo lote para optimizar espacio. |
| **6** | **Aduanas y Envío** | Generación de factura comercial, declaración de aduanas y despacho internacional. |

## 2. Integración con otros Módulos

### Billetera (Wallet)
- En el **Paso 3**, se crea un `Hold` en la cuenta del usuario por el valor de la mercancía + comisión.
- Los fondos no salen de la billetera hasta que el reporte de QC es **Aprobado** por el usuario en el **Paso 4**.
- Si el QC falla y se devuelve al proveedor, se libera el `Hold`.

### Almacén (Warehouse)
- Al completar exitosamente el **Paso 4**, la mercancía se registra automáticamente como un `WarehouseItem` en estado `RECEIVED` en el almacén de China.
- Se hereda el `batchId` del pedido offshore para trazabilidad.

### Envíos (Shipping)
- El **Paso 6** convierte el pedido offshore consolidado en un `Shipment` real con su correspondiente `TrackingId`.

## 3. Estados del Pedido Offshore
- `DRAFT`: Iniciado por el usuario.
- `AWAITING_QUOTATION`: Esperando validación de precios por el agente.
- `PENDING_PAYMENT`: Cotización lista, esperando fondos en billetera.
- `PURCHASE_IN_PROGRESS`: Fondos bloqueados, agente comprando al proveedor.
- `QC_PHASE`: Mercancía en almacén China siendo inspeccionada.
- `READY_FOR_CONSOLIDATION`: QC aprobado.
- `COMPLETED`: Convertido en envío internacional.
- `REJECTED/CANCELLED`: Fallo en algún punto del proceso.

## 4. Gestión de Riesgos
- **Verificación de Proveedor**: El sistema mantiene una lista negra de proveedores fraudulentos en China.
- **Seguro Obligatorio**: Todo pedido offshore incluye un seguro base calculado sobre el valor declarado.
- **Escrow**: El proveedor en China no recibe el pago final hasta que CAINAO confirma la recepción de mercancía en su centro logístico (dependiendo del acuerdo).
