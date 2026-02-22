import { eventBus } from "../../core/events/event-bus";
import { OffshoreOrderCreate, OffshoreStatus, OffshoreTransition } from "./types";

export class OffshoreService {
  /**
   * Crea una nueva solicitud offshore (Paso 1 y 2).
   */
  public async createOrder(data: OffshoreOrderCreate): Promise<Record<string, unknown>> {
    console.log(`[OffshoreService] Creating offshore order for user ${data.userId}`);

    // Simulación de persistencia
    const order = {
      id: "offshore_123",
      ...data,
      status: OffshoreStatus.AWAITING_QUOTATION,
      currentStep: 2,
      createdAt: new Date(),
    };

    eventBus.publish("offshore:order_created", {
      orderId: order.id,
      userId: data.userId,
    });

    return order as unknown as Record<string, unknown>;
  }

  /**
   * Procesa el bloqueo de fondos (Paso 3).
   */
  public async lockFunds(orderId: string, amount: number): Promise<void> {
    console.log(`[OffshoreService] Locking ${amount} for order ${orderId}`);

    // Aquí se llamaría al WalletService para crear un Hold
    eventBus.publish("offshore:funds_locked", {
      orderId,
      amount,
      timestamp: new Date(),
    });

    // Actualizar estado a PURCHASE_IN_PROGRESS
    await this.transitionOrder({
      orderId,
      toStep: 3,
      toStatus: OffshoreStatus.PURCHASE_IN_PROGRESS,
    });
  }

  /**
   * Orquesta las transiciones del flujo de 6 pasos.
   */
  public async transitionOrder(transition: OffshoreTransition): Promise<void> {
    console.log(`[OffshoreService] Transitioning order ${transition.orderId} to Step ${transition.toStep} (${transition.toStatus})`);

    eventBus.publish("offshore:status_changed", {
      orderId: transition.orderId,
      toStatus: transition.toStatus,
      toStep: transition.toStep,
    });

    // Lógica específica
    if (transition.toStatus === OffshoreStatus.COMPLETED) {
      eventBus.publish("offshore:completed", { orderId: transition.orderId });
    }
  }
}

export const offshoreService = new OffshoreService();
