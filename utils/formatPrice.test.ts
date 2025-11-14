/**
 * @file formatPrice.test.ts covers currency and unit label helpers.
 */
import { describe, expect, it } from "vitest";
import { formatPrice, formatUnitPrice } from "./formatPrice";

describe("formatPrice", () => {
  it("returns fallback when price is null", () => {
    expect(formatPrice(null, "USD")).toBe("Цена недоступна");
    expect(formatPrice(null, "USD", { fallback: "Нет данных" })).toBe(
      "Нет данных",
    );
  });

  it("formats USD prices using the ru-RU locale by default", () => {
    const priceCents = 12345; // 123.45
    const expected = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
    }).format(priceCents / 100);

    expect(formatPrice(priceCents, "USD")).toBe(expected);
  });

  it("supports formatting different currencies", () => {
    const priceCents = 6789; // 67.89
    const expected = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "EUR",
    }).format(priceCents / 100);

    expect(formatPrice(priceCents, "EUR")).toBe(expected);
  });
});

describe("formatUnitPrice", () => {
  it("combines amount and units with the default prefix", () => {
    expect(formatUnitPrice(5, "кг")).toBe("за 5 кг");
    expect(formatUnitPrice(2.5, "л")).toBe("за 2.5 л");
  });

  it("returns null when amount or units are missing", () => {
    expect(formatUnitPrice(null, "шт.")).toBeNull();
    expect(formatUnitPrice(1, null)).toBeNull();
  });
});
