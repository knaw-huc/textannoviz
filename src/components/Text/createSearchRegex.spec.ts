import { describe, expect, it } from "vitest";
import { createSearchRegex } from "./createSearchRegex.tsx";

describe(createSearchRegex.name, () => {
  it("matches every term, case insensitive", () => {
    const regex = createSearchRegex("zee Theo", "let001");
    expect("De Zee en theo".match(regex!)).toEqual(["Zee", "theo"]);
  });

  it("ignores repeated and surrounding spaces", () => {
    const regex = createSearchRegex(" zee  theo ", "let001");
    expect(regex?.source).toEqual("zee|theo");
  });

  it("returns nothing for a query of only spaces", () => {
    expect(createSearchRegex("  ", "let001")).toBeUndefined();
  });

  it("escapes regex characters in terms", () => {
    const regex = createSearchRegex("a.b", "let001");
    expect("axb a.b".match(regex!)).toEqual(["a.b"]);
  });
});
