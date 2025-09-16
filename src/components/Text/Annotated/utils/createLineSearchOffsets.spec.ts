import { describe, expect, it } from "vitest";
import { createSearchHighlightOffsets } from "./createSearchHighlightOffsets.ts";

describe("createLineSearchOffsets", () => {
  it("creates search annotation", () => {
    const body = "aa bb cc";
    const regex = /bb/g;
    const result = createSearchHighlightOffsets(body, regex);
    expect(result[0].type).toEqual("highlight");
    expect(result[0].body.type).toEqual("search");
    expect(result[0].startChar).toEqual(3);
    expect(result[0].endChar).toEqual(5);
  });
});
