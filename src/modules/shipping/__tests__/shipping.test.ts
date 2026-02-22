import { describe, it, expect } from "bun:test";
import { ShipmentStatus } from "@prisma/client";
import { canTransition, calculateVolumetricWeight, calculateShippingCost } from "../state-machine";
import { shippingService } from "../shipping.service";
import { eventBus } from "../../../core/events/event-bus";

describe("Shipping Engine - State Machine", () => {
  it("should allow valid transitions", () => {
    expect(canTransition(ShipmentStatus.DRAFT, ShipmentStatus.PENDING)).toBe(true);
    expect(canTransition(ShipmentStatus.IN_TRANSIT, ShipmentStatus.CUSTOMS_HOLD)).toBe(true);
    expect(canTransition(ShipmentStatus.CUSTOMS_CLEARED, ShipmentStatus.ARRIVED_RD)).toBe(true);
  });

  it("should block invalid transitions", () => {
    expect(canTransition(ShipmentStatus.DRAFT, ShipmentStatus.DELIVERED)).toBe(false);
    expect(canTransition(ShipmentStatus.DELIVERED, ShipmentStatus.IN_TRANSIT)).toBe(false);
    expect(canTransition(ShipmentStatus.CANCELLED, ShipmentStatus.PENDING)).toBe(false);
  });
});

describe("Shipping Engine - Cost Calculation", () => {
  it("should calculate volumetric weight correctly", () => {
    // (10 * 10 * 10) / 166 = 6.02
    const vw = calculateVolumetricWeight(10, 10, 10, 166);
    expect(vw).toBeCloseTo(6.02, 1);
  });

  it("should use the highest weight for cost calculation", () => {
    const realWeight = 5;
    const volumetricWeight = 8;
    const rate = 2.5; // $2.5 per lb
    const cost = calculateShippingCost(realWeight, volumetricWeight, rate);

    // 8 * 2.5 = 20
    expect(cost).toBe(20);
  });
});

describe("ShippingService", () => {
  it("should transition status and publish event", async () => {
    let eventPayload: { shipmentId: string; toStatus: ShipmentStatus } | null = null;
    eventBus.subscribe<{ shipmentId: string; toStatus: ShipmentStatus }>("shipment:status_changed", (payload) => {
      eventPayload = payload;
    });

    await shippingService.transitionShipment({
      shipmentId: "ship_123",
      toStatus: ShipmentStatus.PENDING
    }, ShipmentStatus.DRAFT);

    expect(eventPayload).not.toBeNull();
    expect(eventPayload?.shipmentId).toBe("ship_123");
    expect(eventPayload?.toStatus).toBe(ShipmentStatus.PENDING);
  });

  it("should throw error for invalid transition", async () => {
    expect(
      shippingService.transitionShipment({
        shipmentId: "ship_123",
        toStatus: ShipmentStatus.DELIVERED
      }, ShipmentStatus.DRAFT)
    ).rejects.toThrow("Transición no permitida");
  });

  it("should publish delivered event when status is DELIVERED", async () => {
    let deliveredCalled = false;
    eventBus.subscribe("shipment:delivered", () => {
      deliveredCalled = true;
    });

    await shippingService.transitionShipment({
      shipmentId: "ship_456",
      toStatus: ShipmentStatus.DELIVERED
    }, ShipmentStatus.OUT_FOR_DELIVERY);

    expect(deliveredCalled).toBe(true);
  });
});
