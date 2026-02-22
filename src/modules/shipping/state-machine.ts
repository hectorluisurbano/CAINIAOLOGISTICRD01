import { ShipmentStatus } from "@prisma/client";

/**
 * Mapa de transiciones permitidas para el motor de envíos.
 */
export const VALID_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  [ShipmentStatus.DRAFT]: [ShipmentStatus.PENDING, ShipmentStatus.CANCELLED],
  [ShipmentStatus.PENDING]: [ShipmentStatus.RECEIVED_CHINA, ShipmentStatus.CANCELLED],
  [ShipmentStatus.RECEIVED_CHINA]: [ShipmentStatus.IN_TRANSIT, ShipmentStatus.CANCELLED],
  [ShipmentStatus.IN_TRANSIT]: [ShipmentStatus.CUSTOMS_HOLD, ShipmentStatus.ARRIVED_RD, ShipmentStatus.CANCELLED],
  [ShipmentStatus.CUSTOMS_HOLD]: [ShipmentStatus.CUSTOMS_CLEARED, ShipmentStatus.CANCELLED],
  [ShipmentStatus.CUSTOMS_CLEARED]: [ShipmentStatus.ARRIVED_RD, ShipmentStatus.CANCELLED],
  [ShipmentStatus.ARRIVED_RD]: [ShipmentStatus.OUT_FOR_DELIVERY, ShipmentStatus.CANCELLED],
  [ShipmentStatus.OUT_FOR_DELIVERY]: [ShipmentStatus.DELIVERED, ShipmentStatus.ARRIVED_RD],
  [ShipmentStatus.DELIVERED]: [],
  [ShipmentStatus.CANCELLED]: [],
};

/**
 * Valida si una transición de estado es permitida.
 */
export function canTransition(from: ShipmentStatus, to: ShipmentStatus): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed.includes(to);
}

/**
 * Calcula el peso volumétrico basado en el factor de servicio.
 */
export function calculateVolumetricWeight(l: number, w: number, h: number, factor: number = 166): number {
  if (l <= 0 || w <= 0 || h <= 0) return 0;
  return (l * w * h) / factor;
}

/**
 * Calcula el costo dinámico del envío.
 */
export function calculateShippingCost(
  realWeight: number,
  volumetricWeight: number,
  rate: number,
  additionalFees: number = 0
): number {
  const chargeableWeight = Math.max(realWeight, volumetricWeight);
  return (chargeableWeight * rate) + additionalFees;
}
