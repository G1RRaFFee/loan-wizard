import { describe, expect, it } from "vitest";

import { formatPhone } from "../phoneMask";

describe("formatPhone", () => {
  it("should format phone number correctly", () => {
    expect(formatPhone("0123456789")).toBe("0123 456 789");
    expect(formatPhone("012345678")).toBe("0123 456 78");
    expect(formatPhone("01234567")).toBe("0123 456 7");
    expect(formatPhone("0123456")).toBe("0123 456");
    expect(formatPhone("012345")).toBe("0123 45");
    expect(formatPhone("01234")).toBe("0123 4");
    expect(formatPhone("0123")).toBe("0123");
    expect(formatPhone("012")).toBe("012");
    expect(formatPhone("01")).toBe("01");
    expect(formatPhone("0")).toBe("0");
  });

  it("should handle empty string", () => {
    expect(formatPhone("")).toBe("");
  });

  it("should handle null and undefined", () => {
    expect(formatPhone(null as any)).toBe("");
    expect(formatPhone(undefined as any)).toBe("");
  });

  it("should remove non-digit characters", () => {
    expect(formatPhone("0-123-456-789")).toBe("0123 456 789");
    expect(formatPhone("0 123 456 789")).toBe("0123 456 789");
    expect(formatPhone("0.123.456.789")).toBe("0123 456 789");
    expect(formatPhone("0(123)456-789")).toBe("0123 456 789");
  });

  it("should limit to 10 digits", () => {
    expect(formatPhone("01234567890123")).toBe("0123 456 789");
  });

  it("should handle mixed input", () => {
    expect(formatPhone("abc0def123ghi456jkl789")).toBe("0123 456 789");
  });

  it("should handle whitespace only", () => {
    expect(formatPhone("   ")).toBe("");
    expect(formatPhone("\t\n")).toBe("");
  });
});
