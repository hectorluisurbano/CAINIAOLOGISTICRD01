import { eventBus } from "../events/event-bus";
import { describe, it, expect } from "bun:test";

describe("EventBus", () => {
  it("should publish and subscribe to events", () => {
    let receivedData = null;
    const payload = { id: "123", status: "created" };

    eventBus.subscribe("shipment:created", (data) => {
      receivedData = data;
    });

    eventBus.publish("shipment:created", payload);

    expect(receivedData).toEqual(payload);
  });

  it("should trigger audit:log automatically for any event", () => {
    let auditLogged = false;

    eventBus.subscribe("audit:log", (log) => {
      if (log.event === "some:action") {
        auditLogged = true;
      }
    });

    eventBus.publish("some:action", { user: "admin" });

    expect(auditLogged).toBe(true);
  });
});
