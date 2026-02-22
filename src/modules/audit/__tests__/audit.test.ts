import { describe, it, expect } from "bun:test";
import { auditService } from "../audit.service";

describe("Audit Module Logic", () => {
  it("should return filtered logs for USER role", async () => {
    const logs = await auditService.getLogs({}, "USER", "user_123");
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].userId).toBe("user_123");
  });

  it("should format logs correctly for export", async () => {
    const logs = [{ id: 1, action: "test" }];
    const exported = await auditService.exportLogs(logs);
    expect(exported).toContain("test");
    expect(typeof exported).toBe("string");
  });
});
