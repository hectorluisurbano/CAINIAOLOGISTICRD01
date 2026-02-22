import { ShipmentStatus } from "@prisma/client";
import { canTransition } from "./state-machine";
import { eventBus } from "../../core/events/event-bus";
import { ShipmentUpdatePayload } from "./types";

export class ShippingService {
  /**
   * Procesa una transición de estado para un envío.
   */
  public async transitionShipment(payload: ShipmentUpdatePayload, currentStatus: ShipmentStatus): Promise<void> {
    const { shipmentId, toStatus, actorId } = payload;

    // 1. Validar transición
    if (!canTransition(currentStatus, toStatus)) {
      throw new Error(`Transición no permitida de ${currentStatus} a ${toStatus}`);
    }

    // 2. Persistir en DB (Simulado)
    console.log(`[ShippingService] Updating shipment ${shipmentId} to ${toStatus}`);

    // Aquí iría la lógica de Prisma:
    // await prisma.shipment.update({
    //   where: { id: shipmentId },
    //   data: { status: toStatus, trackingHistory: { create: { fromStatus: currentStatus, toStatus, location, description, actorId, metadata } } }
    // });

    // 3. Publicar evento de dominio
    eventBus.publish("shipment:status_changed", {
      shipmentId,
      fromStatus: currentStatus,
      toStatus,
      timestamp: new Date(),
      actorId,
    });

    // 4. Lógica específica por estado
    if (toStatus === ShipmentStatus.DELIVERED) {
      eventBus.publish("shipment:delivered", { shipmentId, actorId });
    }
  }
}

export const shippingService = new ShippingService();
