import { describe, expect, it } from "vitest";
import { getInitials } from "../avatarUtils";

describe("getInitials", () => {
  it("returns initials for multi-word names", () => {
    expect(getInitials("Andri Wirawan")).toBe("AW");
  });

  it("returns one initial for single word names", () => {
    expect(getInitials("Kiki")).toBe("K");
  });

  it("handles empty or invalid values", () => {
    expect(getInitials("")).toBe("?");
    expect(getInitials("   ")).toBe("?");
    expect(getInitials(undefined)).toBe("?");
  });
});
