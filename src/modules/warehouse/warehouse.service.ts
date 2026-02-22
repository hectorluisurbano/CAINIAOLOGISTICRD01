import { eventBus } from "../../core/events/event-bus";
import { WarehouseItemReception, WarehouseStatus } from "./types";

export class WarehouseService {
  /**
   * Genera un SKU automático siguiendo el patrón corporativo.
   */
  public generateSKU(index: number = 1): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const sequence = String(index).padStart(4, "0");
    return `CN-${date}-${sequence}`;
  }

  /**
   * Procesa la recepción de un artículo.
   */
  public async receiveItem(data: WarehouseItemReception): Promise<Record<string, unknown>> {
    const sku = this.generateSKU();

    console.log(`[WarehouseService] Receiving item with SKU: ${sku}`);

    // Simulación de persistencia
    const item = {
      ...data,
      sku,
      status: WarehouseStatus.RECEIVED,
      receivedAt: new Date(),
    };

    eventBus.publish("warehouse:item_received", {
      sku,
      userId: data.userId,
      timestamp: item.receivedAt,
    });

    return item;
  }

  /**
   * Calcula la penalización por almacenamiento extendido.
   * Período de gracia: 30 días.
   * Tarifa: $0.50 por unidad de peso por día excedido.
   */
  public calculateStoragePenalty(receivedAt: Date, weight: number, now: Date = new Date()): number {
    const gracePeriodDays = 30;
    const dailyRate = 0.5;

    const diffTime = Math.abs(now.getTime() - receivedAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= gracePeriodDays) return 0;

    const daysExceeded = diffDays - gracePeriodDays;
    return daysExceeded * weight * dailyRate;
  }

  /**
   * Pre-rellena los datos para convertir artículos de almacén en un envío.
   */
  public prepareShipmentData(items: Array<{ weight?: number; sku?: string }>): Record<string, unknown> {
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0), 0);

    // Simplificación: se asume que las dimensiones se consolidan o se toma el volumen total
    // Aquí se retornaría un objeto compatible con el motor de envíos
    return {
      weightReal: totalWeight,
      itemCount: items.length,
      itemSkus: items.map(i => i.sku),
    };
  }
}

export const warehouseService = new WarehouseService();
