import { describe, expect, it } from "vitest";
import { createSearchOffsets } from "./createSearchOffsets.ts";

describe("createLineSearchOffsets", () => {
  it("creates search annotation", () => {
    const lines = ["aa bb cc"];
    const regex = /bb/g;
    const result = createSearchOffsets(lines, regex);
    expect(result[0].type).toEqual("search");
    expect(result[0].startChar).toEqual(3);
    expect(result[0].endChar).toEqual(5);
  });
});
