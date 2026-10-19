import { describe, expect, it } from "vitest";
import {
  getParagraphPanel,
  parseParagraphReference,
} from "./paragraphReference";

describe("parseParagraphReference", () => {
  it("parses a paragraph in the current letter", () => {
    expect(parseParagraphReference("#p.orig.57")).toEqual({
      paragraphId: "p.orig.57",
    });
  });

  it("parses a paragraph in another letter", () => {
    expect(parseParagraphReference("let093.xml#p.orig.21")).toEqual({
      letterId: "let093",
      paragraphId: "p.orig.21",
    });
  });

  it("ignores references that are not to a paragraph", () => {
    expect(parseParagraphReference(undefined)).toBeNull();
    expect(parseParagraphReference("let093.xml")).toBeNull();
    expect(parseParagraphReference("introVI.xml#intro.VI.5.3.1")).toBeNull();
    expect(parseParagraphReference("#intro.II.4.1")).toBeNull();
    expect(parseParagraphReference("https://example.org/#p.1")).toBeNull();
  });
});

describe("getParagraphPanel", () => {
  it("finds the panel from the paragraph id", () => {
    expect(getParagraphPanel("p.orig.21")).toBe("text.orig");
    expect(getParagraphPanel("p.trans.21")).toBe("text.trans");
  });

  it("ignores ids that are not a paragraph's", () => {
    expect(getParagraphPanel("toc-head.4")).toBeUndefined();
    expect(getParagraphPanel("p.other.1")).toBeUndefined();
  });
});
