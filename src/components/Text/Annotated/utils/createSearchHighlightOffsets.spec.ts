import { HighlightBody, isSearchHighlightBody } from "./highlightBodyGuards.ts";
import { BroccoliTextGeneric } from "../../../../model/Broccoli.ts";
import { describe, expect, it } from "vitest";
import {
  createSearchHighlightOffsets,
  findSearchHits,
} from "./createSearchHighlightOffsets.ts";

function text(body: string, bodyId = "text-1"): BroccoliTextGeneric {
  return {
    body,
    locations: { relativeTo: { bodyId, bodyType: "Text" }, annotations: [] },
  };
}

describe(createSearchHighlightOffsets.name, () => {
  it("creates search annotation", () => {
    const regex = /bb/g;
    const result = createSearchHighlightOffsets(text("aa bb cc"), regex);
    expect(result[0].type).toEqual("highlight");
    expect((result[0].body as HighlightBody).type).toEqual("search");
    expect(result[0].start).toEqual(3);
    expect(result[0].end).toEqual(5);
  });

  it("anchors each hit by the text it is in and its offset", () => {
    const regex = /bb/g;
    const anchors = (bodyId: string) =>
      createSearchHighlightOffsets(text("bb bb", bodyId), regex).map(
        (offset) => {
          const body = offset.body as HighlightBody;
          return isSearchHighlightBody(body) && body.anchor;
        },
      );
    expect(anchors("orig")).toEqual(["search:orig:0", "search:orig:3"]);
    expect(anchors("trans")).toEqual(["search:trans:0", "search:trans:3"]);
  });
});

describe(findSearchHits.name, () => {
  it("finds every hit, in text order", () => {
    expect(findSearchHits("aa bb cc bb", /bb|cc/gi)).toEqual([
      [3, 5],
      [6, 8],
      [9, 11],
    ]);
  });

  it("skips empty matches instead of looping on them", () => {
    expect(findSearchHits("aa bb", /bb|/gi)).toEqual([[3, 5]]);
  });

  it("finds the same hits when the regex is reused across texts", () => {
    const regex = /bb/gi;
    expect(findSearchHits("bb bb", regex)).toEqual([
      [0, 2],
      [3, 5],
    ]);
    expect(findSearchHits("bb", regex)).toEqual([[0, 2]]);
  });
});
