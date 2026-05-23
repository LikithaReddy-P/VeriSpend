import { describe, expect, it } from "vitest";
import {
  calculateConsolidationSavings,
  calculateSavings,
  calculateSeatRightsizingSavings,
  sumSavings,
} from "@/lib/audit/engine/savings/calculate";

describe("calculateSavings", () => {
  it("returns zero when recommended spend exceeds current", () => {
    expect(calculateSavings(100, 150)).toEqual({
      monthlySavings: 0,
      annualSavings: 0,
    });
  });

  it("computes monthly and annual savings", () => {
    expect(calculateSavings(600, 360)).toEqual({
      monthlySavings: 240,
      annualSavings: 2880,
    });
  });
});

describe("calculateSeatRightsizingSavings", () => {
  it("prorates spend when reducing seats", () => {
    const result = calculateSeatRightsizingSavings(228, 6, 4);
    expect(result.monthlySavings).toBe(76);
    expect(result.annualSavings).toBe(912);
  });
});

describe("calculateConsolidationSavings", () => {
  it("applies recoverable ratio to lower-cost tool", () => {
    expect(calculateConsolidationSavings(100, 0.35)).toEqual({
      monthlySavings: 35,
      annualSavings: 420,
    });
  });
});

describe("sumSavings", () => {
  it("aggregates recommendation savings", () => {
    expect(
      sumSavings([{ monthlySavings: 100 }, { monthlySavings: 50 }])
    ).toEqual({
      monthlySavings: 150,
      annualSavings: 1800,
    });
  });
});
