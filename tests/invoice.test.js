import { describe, expect, it } from "vitest";
import { invoiceTotals, lineTotal, priceHT } from "../utils/invoice";

describe("invoice", () => {
  it("computes the totals the way the invoice PDF always has", () => {
    const lines = [
      { price: 12.5, quantity: 3 },
      { price: 4.99, quantity: 7 },
    ];
    // 37.5 + 34.93 = 72.43 TTC; HT = 72.43 / 1.2; fee = 22.5 %
    expect(invoiceTotals(lines)).toEqual({
      ttc: 72.43,
      ht: 60.36,
      fee: 16.3,
      toPay: 56.13,
    });
  });

  it("rounds each line to the cent", () => {
    expect(lineTotal({ price: 0.1, quantity: 3 })).toBe(0.3);
    expect(priceHT(10)).toBe(8.33);
  });

  it("handles an empty invoice", () => {
    expect(invoiceTotals([])).toEqual({ ttc: 0, ht: 0, fee: 0, toPay: 0 });
  });
});
