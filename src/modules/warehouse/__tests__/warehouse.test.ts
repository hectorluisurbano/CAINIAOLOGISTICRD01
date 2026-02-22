import { describe, it, expect } from "bun:test";
import { warehouseService } from "../warehouse.service";

describe("Warehouse Module Logic", () => {

  it("should generate SKU in the correct format", () => {
    const sku = warehouseService.generateSKU(123);
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    expect(sku).toBe(`CN-${datePart}-0123`);
  });

  it("should calculate zero penalty during grace period", () => {
    const receivedAt = new Date();
    receivedAt.setDate(receivedAt.getDate() - 15); // 15 days ago

    const penalty = warehouseService.calculateStoragePenalty(receivedAt, 10);
    expect(penalty).toBe(0);
  });

  it("should calculate correct penalty after grace period", () => {
    const receivedAt = new Date();
    receivedAt.setDate(receivedAt.getDate() - 35); // 35 days ago (5 days extra)

    // 5 days * 10 lbs * 0.5 rate = 25
    const penalty = warehouseService.calculateStoragePenalty(receivedAt, 10);
    expect(penalty).toBe(25);
  });

  it("should prepare shipment data from items", () => {
    const items = [
      { sku: "SKU1", weight: 5 },
      { sku: "SKU2", weight: 3 },
      { sku: "SKU3", weight: 2 }
    ];

    const data = warehouseService.prepareShipmentData(items);
    expect(data.weightReal).toBe(10);
    expect(data.itemSkus).toContain("SKU1");
    expect(data.itemCount).toBe(3);
  });
});
