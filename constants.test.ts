/**
 * @file constants.test.ts ensures runtime env validation exports values.
 */
import { describe, expect, it } from "vitest";

describe("constants", () => {
  it("exports HUB_ID, ORDERS_API_URL, and CRM_API_URL", async () => {
    const constants = await import("./constants");
    expect(constants.HUB_ID).toBeDefined();
    expect(constants.ORDERS_API_URL).toBeDefined();
    expect(constants.CRM_API_URL).toBeDefined();
  });
});
