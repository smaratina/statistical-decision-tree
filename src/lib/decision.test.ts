import { describe, expect, it } from "vitest";

import { decide, type Answers } from "./decision";

const mediation: Answers = {
  question: "Does M mediate the relationship between X and Y?",
  goal: "mediation",
  design: "observational",
  measurement: "one",
  groups: "one",
  outcome: "continuous",
  extra: "mediator",
  sampleSize: 94,
  assumptions: "unknown",
  planned: "linear_reg",
};

describe("deterministic statistical decision engine", () => {
  it("recommends bootstrap mediation and flags an incompatible linear-regression plan", () => {
    const result = decide(mediation, "en");
    expect(result.method).toContain("Bootstrap mediation");
    expect(result.audit.warn).toBe(true);
    expect(result.code.r).toContain("indirect := a*b");
  });

  it("returns the same decision structure in Greek", () => {
    const result = decide(mediation, "el");
    expect(result.method).toContain("διαμεσολάβησης");
    expect(result.reasons.length).toBeGreaterThanOrEqual(3);
    expect(result.assumptions.length).toBeGreaterThanOrEqual(3);
  });

  it("uses an independent-samples comparison for two independent groups", () => {
    const result = decide(
      {
        goal: "compare",
        design: "observational",
        measurement: "independent",
        groups: "two",
        outcome: "continuous",
        assumptions: "met",
        planned: "ind_ttest",
      },
      "en",
    );
    expect(result.method).toContain("Independent-samples t-test");
    expect(result.audit.warn).toBe(false);
  });

  it("falls back safely when the design is underspecified", () => {
    const result = decide({ question: "What should I do?" }, "en");
    expect(result.fit).toBe("Conditional");
    expect(result.method).toContain("Descriptive");
  });
});
