import { describe, expect, it } from "vitest";
import { createSearchAnnotations } from "./createSearchAnnotations.ts";

describe("createSearchAnnotations", () => {
  it("creates search annotation", () => {
    const lines = ["aa bb cc"];
    const regex = /bb/g;
    const result = createSearchAnnotations(lines, regex);
    expect(result[0].type).toEqual("search");
    expect(result[0].startChar).toEqual(3);
    expect(result[0].endChar).toEqual(5);
  });
});
