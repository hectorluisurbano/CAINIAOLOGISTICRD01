import { ShipmentStatus } from "@prisma/client";

export interface ShipmentUpdatePayload {
  shipmentId: string;
  toStatus: ShipmentStatus;
  location?: string;
  description?: string;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface ShippingCostRequest {
  realWeight: number;
  l: number;
  w: number;
  h: number;
  serviceFactor?: number;
  rate: number;
  additionalFees?: number;
}
