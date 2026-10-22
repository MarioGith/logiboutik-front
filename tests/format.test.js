import { describe, expect, it } from "vitest";
import { capitalize, formatDate, formatPrice, nextDay } from "../utils/format";

describe("format", () => {
  it("shows dates in the local time zone, not in UTC", () => {
    // A date picked at local midnight is stored as the previous day in UTC
    // for users east of Greenwich; it must still show the picked day.
    const picked = new Date(2024, 2, 5); // 5 March 2024, local midnight
    expect(formatDate(picked.toISOString())).toBe("05/03/2024");
  });

  it("returns midnight of the next local day", () => {
    const end = nextDay(new Date(2024, 0, 31, 15, 30));
    expect(end).toEqual(new Date(2024, 1, 1));
  });

  it("formats prices and names", () => {
    expect(formatPrice(12.5)).toBe("12.50 €");
    expect(capitalize("pot")).toBe("Pot");
    expect(capitalize("")).toBe("");
  });
});
