import { describe, expect, it } from "vitest";
import { sanitizeAnswer, sanitizeContributor } from "../dataGuards";

describe("dataGuards", () => {
  it("sanitizes empty answer payload with safe defaults", () => {
    const answer = sanitizeAnswer({});

    expect(answer.author).toBe("Anonim");
    expect(answer.paragraphs).toEqual(["Konten jawaban belum tersedia."]);
    expect(answer.replies).toEqual([]);
    expect(answer.likes).toBe(0);
  });

  it("sanitizes empty contributor payload with safe defaults", () => {
    const contributor = sanitizeContributor({});

    expect(contributor.name).toBe("Kontributor");
    expect(contributor.stats.answer).toBe("0");
    expect(contributor.stats.approved).toBe("-");
    expect(contributor.stats.joined).toBe("-");
  });
});
