/**
 * @file constants.test.ts ensures runtime env validation exports values.
 */
import { describe, expect, it } from "vitest";

describe("constants", () => {
  it("exports HUB_ID and API_URL", async () => {
    const constants = await import("./constants");
    expect(constants.HUB_ID).toBeDefined();
    expect(constants.API_URL).toBeDefined();
  });
});
