import { describe, expect, it } from "vitest";
import { parseXPath } from "./parseXPath.ts";

describe(parseXPath.name, () => {
  it("parses a step with no namespace or index", () => {
    expect(parseXPath("/table")).toEqual([{ tag: "table", index: 1 }]);
  });

  it("parses a step with a namespace", () => {
    expect(parseXPath("/tei:table")).toEqual([{ tag: "table", index: 1 }]);
  });

  it("parses a step with an index", () => {
    expect(parseXPath("/tei:table[2]")).toEqual([{ tag: "table", index: 2 }]);
  });

  it("parses multiple steps", () => {
    expect(parseXPath("/tei:table[1]/tei:row[2]/tei:cell[1]")).toEqual([
      { tag: "table", index: 1 },
      { tag: "row", index: 2 },
      { tag: "cell", index: 1 },
    ]);
  });

  it("ignores a leading double slash", () => {
    expect(parseXPath("//tei:table")).toEqual([{ tag: "table", index: 1 }]);
  });

  it("parses the xpath of a figure nested in a table cell", () => {
    expect(
      parseXPath(
        "/tei:TEI/tei:text[1]/tei:body[1]/tei:div[1]/tei:div[1]/tei:div[4]/tei:table[1]/tei:row[1]/tei:cell[1]/tei:figure[1]",
      ),
    ).toEqual([
      { tag: "TEI", index: 1 },
      { tag: "text", index: 1 },
      { tag: "body", index: 1 },
      { tag: "div", index: 1 },
      { tag: "div", index: 1 },
      { tag: "div", index: 4 },
      { tag: "table", index: 1 },
      { tag: "row", index: 1 },
      { tag: "cell", index: 1 },
      { tag: "figure", index: 1 },
    ]);
  });
});
