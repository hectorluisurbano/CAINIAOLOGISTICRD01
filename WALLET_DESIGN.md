# Diseño del Sistema de Billetera Financiera - CAINAO SHIPPING

Este documento describe la arquitectura y el flujo operativo del sistema de billetera digital, diseñado para garantizar la integridad financiera, la trazabilidad total y la escalabilidad.

## 1. Modelo Contable: Partida Doble
El sistema utiliza un **Ledger Contable de Partida Doble** (Double-Entry Bookkeeping). Esto significa que el dinero no se "mueve" simplemente; se registra como una transferencia entre cuentas.

### Conceptos Clave:
- **JournalEntry**: Un asiento contable que agrupa dos o más movimientos (`LedgerEntry`). La suma de los montos en un JournalEntry debe ser siempre **cero**.
- **LedgerEntry**: Un registro individual en una cuenta. Un valor positivo es un **Crédito** (aumento de saldo) y un valor negativo es un **Débito** (disminución de saldo).
- **Accounts**:
    - **User Accounts**: Saldos de los clientes.
    - **System Accounts**: Cuentas operativas de la empresa (Ingresos, Gastos, Impuestos).
    - **Suspense Accounts**: Cuentas temporales para fondos en tránsito o errores.

## 2. Multi-moneda
El sistema soporta USD, DOP y CNY.
- Cada cuenta está denominada en una moneda específica.
- Las transacciones entre monedas requieren un `ExchangeRate` registrado en el momento del asiento.
- Se mantiene el monto original (`originalAmount`) y la moneda original (`originalCurrency`) para auditoría.

## 3. Bloqueo de Fondos (Hold / Escrow)
Para servicios como el **Offshore Import**, se utiliza un mecanismo de bloqueo:
1. Se crea un registro en la tabla `Hold`.
2. El balance "disponible" del usuario disminuye, pero el balance "contable" permanece igual.
3. El fondo queda bloqueado hasta que se **Ejecuta** (se convierte en un JournalEntry de pago) o se **Libera** (vuelve a estar disponible).

## 4. Flujo de una Transacción (Ejemplo: Pago de Envío)
1. **Validación**: Verificar si el balance disponible >= monto.
2. **Atomicidad**: Abrir una transacción de base de datos.
3. **Journal Entry**:
    - `LedgerEntry` 1: Débito en la cuenta del Usuario (-$50).
    - `LedgerEntry` 2: Crédito en la cuenta Operativa de Envíos (+$50).
4. **Actualización de Balance**: Actualizar el `balance` en la tabla `Account` usando **Optimistic Locking** (`version`).
5. **Evento**: Publicar `TransactionCompleted` en el `EventBus`.

## 5. Manejo de Errores e Inconsistencias
- **Idempotencia**: Cada solicitud de transacción debe incluir un `idempotencyKey` único (ej. `pay_shipment_123`). Si se recibe la misma clave, se devuelve el resultado anterior sin procesar de nuevo.
- **Transacciones Atómicas**: El uso de Prisma Transactions garantiza que o se registran todos los asientos y balances, o no se registra nada.
- **Conciliación Diaria**: Proceso automatizado que verifica:
    - Suma(LedgerEntries) == Balance de la Cuenta.
    - Suma(JournalEntries) == 0.

## 6. Estrategia Antifraude y Auditoría
- **Inmutabilidad**: Los registros de `LedgerEntry` y `JournalEntry` nunca se borran ni se editan. Los errores se corrigen mediante **Reversiones** (asientos inversos).
- **Límites Operativos**: Alertas automáticas para transacciones inusualmente grandes o múltiples recargas fallidas.
- **Auditoría Completa**: Cada movimiento financiero está vinculado a un `AuditLog` que registra el contexto (IP, dispositivo, ID de sesión).

## 7. Integración con Stripe/Bancos
El sistema está preparado para pasarelas externas:
- **Webhooks**: Se reciben notificaciones de Stripe, se valida la firma y se genera el JournalEntry de recarga correspondiente de forma asíncrona pero idempotente.
- **Referencia Externa**: El campo `referenceId` vincula el asiento contable con el ID de transacción de Stripe o el número de transferencia bancaria.
