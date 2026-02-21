import { hasPermission, validateRole } from "../auth/rbac";
import { describe, it, expect } from "bun:test";

describe("RBAC", () => {
  it("USER should only have USER permission", () => {
    expect(hasPermission("USER", "USER")).toBe(true);
    expect(hasPermission("USER", "AGENT")).toBe(false);
    expect(hasPermission("USER", "ADMIN")).toBe(false);
  });

  it("AGENT should have USER and AGENT permission", () => {
    expect(hasPermission("AGENT", "USER")).toBe(true);
    expect(hasPermission("AGENT", "AGENT")).toBe(true);
    expect(hasPermission("AGENT", "ADMIN")).toBe(false);
  });

  it("ADMIN should have all permissions", () => {
    expect(hasPermission("ADMIN", "USER")).toBe(true);
    expect(hasPermission("ADMIN", "AGENT")).toBe(true);
    expect(hasPermission("ADMIN", "ADMIN")).toBe(true);
  });

  it("validateRole should throw if unauthorized", () => {
    expect(() => validateRole("USER", "ADMIN")).toThrow();
    expect(() => validateRole("ADMIN", "USER")).not.toThrow();
  });
});
