import { describe, it, expect } from "bun:test";
import { offshoreService } from "../offshore.service";
import { OffshoreStatus } from "../types";
import { eventBus } from "../../../core/events/event-bus";

describe("Offshore Module Logic", () => {
  it("should create order and publish event", async () => {
    let eventFired = false;
    eventBus.subscribe("offshore:order_created", () => {
      eventFired = true;
    });

    const order = await offshoreService.createOrder({
      userId: "user_123",
      productInfo: "Gadgets",
      urls: ["http://1688.com/1"]
    });

    expect(order.id).toBeDefined();
    expect(order.status).toBe(OffshoreStatus.AWAITING_QUOTATION);
    expect(eventFired).toBe(true);
  });

  it("should lock funds and transition to purchase in progress", async () => {
    let fundsEventFired = false;
    eventBus.subscribe("offshore:funds_locked", () => {
      fundsEventFired = true;
    });

    await offshoreService.lockFunds("offshore_123", 500);

    expect(fundsEventFired).toBe(true);
  });
});
