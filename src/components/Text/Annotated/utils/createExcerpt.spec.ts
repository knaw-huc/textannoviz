import { describe, expect, it } from "vitest";
import { createExcerpt } from "./createExcerpt.ts";

/** Excerpt of the first occurrence of hit in body */
function excerptOf(body: string, hit: string, radius?: number) {
  const begin = body.indexOf(hit);
  return createExcerpt(body, begin, begin + hit.length, radius);
}

describe(createExcerpt.name, () => {
  it("keeps the whole text when it fits", () => {
    expect(excerptOf("I saw the sea today", "sea")).toEqual({
      before: "I saw the ",
      match: "sea",
      after: " today",
    });
  });

  it("cuts back to word boundaries, never mid-word", () => {
    expect(
      excerptOf("I walked along the wide sea and the dunes", "sea", 9),
    ).toEqual({
      before: "…the wide ",
      match: "sea",
      after: " and the…",
    });
  });

  it("marks only the side that was cut", () => {
    expect(excerptOf("sea and the long dunes beyond", "sea", 8)).toEqual({
      before: "",
      match: "sea",
      after: " and the…",
    });
    expect(excerptOf("beyond the long dunes, the sea", "sea", 10)).toEqual({
      before: "…the ",
      match: "sea",
      after: "",
    });
  });

  it("collapses line breaks and runs of whitespace", () => {
    expect(excerptOf("Dear Theo,\n\n  the   sea\nis grey", "sea")).toEqual({
      before: "Dear Theo, the ",
      match: "sea",
      after: " is grey",
    });
  });

  it("cuts a single long word rather than dropping the side", () => {
    expect(excerptOf("Zuiderzeewerkenvergadering sea", "sea", 8)).toEqual({
      before: "…adering ",
      match: "sea",
      after: "",
    });
  });

  it("handles a hit spanning the whole text", () => {
    expect(excerptOf("sea", "sea")).toEqual({
      before: "",
      match: "sea",
      after: "",
    });
  });
});
