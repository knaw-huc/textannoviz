import { describe, expect, it } from "vitest";
import {
  BlockAnnotationSegment,
  Body,
  MarkerSegment,
  GrouplessNestedSegment,
  TextOffsets,
} from "../AnnotationModel.ts";
import { createSegments } from "./createSegments.ts";
import { BlockSchema } from "../block";

const emptySchema: BlockSchema = {
  root: "root",
  blocks: {
    root: { children: [] },
  },
};

const paragraphSchema: BlockSchema = {
  root: "root",
  blocks: {
    root: { children: ["paragraph"] },
    paragraph: { children: [] },
  },
};

const sectionSchema: BlockSchema = {
  root: "root",
  blocks: {
    root: { children: ["section"] },
    section: { children: ["p"] },
    p: { children: [] },
  },
};

// Both can be parent and child of each other:
const mutualSchema: BlockSchema = {
  root: "root",
  blocks: {
    root: { children: ["div", "section"] },
    div: { children: ["section"] },
    section: { children: ["div"] },
  },
};

describe("createSegments", () => {
  const body = "aabbccddee";
  const annotations: TextOffsets[] = [
    { type: "nested", body: { id: "anno1" } as Body, begin: 2, end: 6 },
    { type: "nested", body: { id: "anno2" } as Body, begin: 4, end: 6 },
    { type: "nested", body: { id: "anno3" } as Body, begin: 4, end: 8 },
  ];

  it("starts with segment of text without annotations when no annotation found", () => {
    const result = createSegments(body, annotations, emptySchema);
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const segments = createSegments(body, annotations, emptySchema);
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].body.id).toEqual("anno1");
  });

  it("creates segment of text with multiple annotations in size order", () => {
    const segments = createSegments(body, annotations, emptySchema);
    expect(segments[2].body).toEqual("cc");
    const ids = segments[2].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["anno1", "anno3", "anno2"]);
  });

  it("ends with segment of text without annotations when no annotation found", () => {
    const segments = createSegments(body, annotations, emptySchema);
    expect(segments[4].body).toEqual("ee");
    expect(segments[4].annotations).toEqual([]);
  });

  it("can start with and end without annotation", () => {
    const segments = createSegments("aab", [ann("anno1", 0, 2)], emptySchema);
    expect(segments[0].body).toEqual("aa");
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toBe("anno1");
    expect(segments[1].body).toBe("b");
    expect(segments[1].annotations).toEqual([]);
  });

  it("can start without and end with annotation", () => {
    const segments = createSegments("abb", [ann("anno1", 1, 3)], emptySchema);
    expect(segments[0].body).toEqual("a");
    expect(segments[0].annotations).toEqual([]);
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].body.id).toEqual("anno1");
  });

  it("can contain no annotations", () => {
    const segments = createSegments("a", [], emptySchema);
    expect(segments.length).toEqual(1);
    expect(segments[0].body).toEqual("a");
    expect(segments[0].annotations).toEqual([]);
  });

  it("keeps annotationless text in between annotations", () => {
    const segments = createSegments(
      "aabbcc",
      [ann("anno1", 0, 2), ann("anno2", 4, 6)],
      emptySchema,
    );
    expect(segments.length).toEqual(3);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("anno1");
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations).toEqual([]);
    expect(segments[2].annotations.length).toEqual(1);
    expect(segments[2].annotations[0].body.id).toEqual("anno2");
  });

  it("sorts annotations by length when starting at the same char index", () => {
    const segments = createSegments(
      "aabbcc",
      [ann("abc", 0, 6), ann("ab", 0, 4), ann("bc", 2, 6)],
      emptySchema,
    );
    expect(segments[0].annotations[0].body.id).toEqual("abc");
    expect(segments[0].annotations[1].body.id).toEqual("ab");
    expect(segments[1].annotations[1].body.id).toEqual("ab");
  });

  it("sets start and end segment", () => {
    const segments = createSegments("aabbccdd", [ann("bc", 2, 6)], emptySchema);
    const bc = segments[1].annotations[0] as GrouplessNestedSegment;
    expect(bc.body.id).toEqual("bc");
    expect(bc.beginSegment).toEqual(1);
    expect(bc.endSegment).toEqual(2);
  });

  it("sets start and end segment when opening and closing at first and last segment", () => {
    const segments = createSegments("aabbcc", [ann("abc", 0, 6)], emptySchema);
    const abc = segments[0].annotations[0] as GrouplessNestedSegment;
    expect(abc.body.id).toEqual("abc");
    expect(abc.beginSegment).toEqual(0);
    expect(abc.endSegment).toEqual(1);
  });

  it("creates empty note marker segment with endSegment equal to beginSegment", () => {
    const segments = createSegments(
      "aabb",
      [mrk("urn:foo:ptr:1", 2)],
      emptySchema,
    );
    expect(segments.length).toBe(3);
    const markerSegment = segments[1];
    expect(markerSegment.body).toEqual("");
    expect(markerSegment.annotations.length).toBe(1);
    const marker = markerSegment.annotations[0] as MarkerSegment;
    expect(marker.body.id).toEqual("urn:foo:ptr:1");
  });

  it("can contain bodiless marker", () => {
    const segments = createSegments("ab", [mrk("marker1", 1)], emptySchema);
    expect(segments.length).toEqual(3);
    expect(segments[1].body).toEqual("");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].type).toEqual("marker");
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("can contain bodiless marker after last char", () => {
    const segments = createSegments("a", [mrk("marker1", 1)], emptySchema);
    expect(segments.length).toEqual(2);
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("creates one text segment when empty text contains marker", () => {
    const segments = createSegments("", [mrk("marker1", 0)], emptySchema);
    expect(segments.length).toEqual(1);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
  });

  it("creates two text segments when single space contains marker at char 0", () => {
    const segments = createSegments(" ", [mrk("marker1", 0)], emptySchema);
    expect(segments.length).toEqual(2);
    expect(segments[0].body).toBe("");
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
    expect(segments[1].body).toBe(" ");
    expect(segments[1].annotations.length).toEqual(0);
  });

  it("Includes marker segment when indexing segments", () => {
    const text =
      "schetsen.\n\n020 – Isaac Israëls, Vrouwenkop in profiel, 1895. Van Gogh Museum, Amsterdam. (Ill. 14)\n\n049 – Isaac Israëls, Boerin die een juk draagt, 1897";
    const segments = createSegments(
      text,
      [ann("id1", 13, 16), hgl("id2", 13, 100), mrk("id3", 13)],
      emptySchema,
    );
    const segmentWithMarker = segments[1];
    expect(segmentWithMarker.index).toBe(1);
    const segmentAfterMarker = segments[2];
    expect(segmentAfterMarker.index).toBe(2);
  });

  it("creates block annotation segment", () => {
    const segments = createSegments(
      "aabb",
      [blk("b1", 0, 4, "paragraph")],
      paragraphSchema,
    );
    expect(segments.length).toBe(1);
    expect(segments[0].annotations.length).toBe(1);
    const b = segments[0].annotations[0] as BlockAnnotationSegment;
    expect(b.type).toBe("block");
    expect(b.body.id).toBe("b1");
    expect(b.blockType).toBe("paragraph");
  });

  it("creates segments with mixed annotation types", () => {
    const segments = createSegments(
      "aabbcc",
      [ann("a1", 0, 4), mrk("m1", 2), hgl("h1", 4, 6)],
      emptySchema,
    );
    expect(segments.length).toBe(4);
    expect(segments[0].body).toBe("aa");
    expect(segments[0].annotations[0].type).toBe("nested");
    expect(segments[1].body).toBe("");
    expect(segments[1].annotations[0].type).toBe("marker");
    expect(segments[2].body).toBe("bb");
    expect(segments[3].body).toBe("cc");
    expect(segments[3].annotations[0].type).toBe("highlight");
  });

  it("sets correct index on annotationless end segment", () => {
    const segments = createSegments("aabb", [ann("a1", 0, 2)], emptySchema);
    expect(segments[0].index).toBe(0);
    expect(segments[1].index).toBe(1);
  });

  it("keeps (block) annotation order in place", () => {
    const segments = createSegments(
      "aa",
      [blk("s1", 0, 2, "section"), blk("p1", 0, 2, "p")],
      sectionSchema,
    );
    const blocks = segments[0].annotations.filter(
      (a) => a.type === "block",
    ) as BlockAnnotationSegment[];
    expect(blocks[0].body.id).toBe("s1");
    expect(blocks[1].body.id).toBe("p1");
  });

  it("returns same annotation segment reference across segments", () => {
    const segments = createSegments(
      "aabb",
      [ann("a", 0, 4), ann("b", 2, 4)],
      emptySchema,
    );
    const aInFirstSegment = segments[0].annotations[0];
    const aInSecondSegment = segments[1].annotations[0];
    expect(aInFirstSegment.body.id).toBe("a");
    expect(aInSecondSegment.body.id).toBe("a");
    expect(aInFirstSegment).toBe(aInSecondSegment);
  });

  it("sorts annotations by starting position", () => {
    const segments = createSegments(
      "abc",
      [ann("bc", 1, 3), ann("ab", 0, 2)],
      emptySchema,
    );
    const ids = segments[1].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["ab", "bc"]);
  });

  it("sorts annotations largest-first", () => {
    const segments = createSegments(
      "ab",
      [ann("a", 0, 1), ann("ab", 0, 2)],
      emptySchema,
    );
    const ids = segments[0].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["ab", "a"]);
  });

  it("keeps sorting order for same sized annotations", () => {
    const segments = createSegments(
      "ab",
      [
        ann("a1", 0, 1),
        ann("a3", 0, 1),
        ann("a2", 0, 1),
        hgl("h1", 0, 1),
        ann("a4", 0, 1),
        hgl("h3", 0, 1),
        hgl("h2", 0, 1),
        ann("a5", 0, 1),
      ],
      emptySchema,
    );
    const ids = segments[0].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["a1", "a3", "a2", "h1", "a4", "h3", "h2", "a5"]);
  });

  it("places markers before annotations with length", () => {
    const segments = createSegments(
      "abc",
      [ann("abc", 0, 3), mrk("marker", 1), ann("bc", 1, 3)],
      emptySchema,
    );
    const markerSegment = segments[1];
    const ids = markerSegment.annotations.map((a) => a.body.id);
    expect(ids).toEqual(["marker", "abc", "bc"]);
  });

  it("sorts blocks by schema order", () => {
    const segments = createSegments(
      "aa",
      [blk("p1", 0, 2, "p"), blk("s1", 0, 2, "section")],
      sectionSchema,
    );
    const ids = segments[0].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["s1", "p1"]);
  });

  it("keeps order when blocks can both contain each other", () => {
    const segments = createSegments(
      "aa",
      [
        blk("d2", 0, 2, "div"),
        blk("s1", 0, 2, "section"),
        blk("d1", 0, 2, "div"),
        blk("s2", 0, 2, "section"),
      ],
      mutualSchema,
    );
    const ids = segments[0].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["d2", "s1", "d1", "s2"]);
  });

  it("sorts mutually containable blocks by length when lengths differ", () => {
    const segments = createSegments(
      "aabb",
      [blk("s1", 0, 2, "section"), blk("d1", 0, 4, "div")],
      mutualSchema,
    );
    const ids = segments[0].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["d1", "s1"]);
  });
});

function ann(id: string, begin: number, end: number): TextOffsets {
  return { type: "nested", body: { id } as Body, begin, end };
}

function hgl(id: string, begin: number, end: number): TextOffsets {
  return { type: "highlight", body: { id } as Body, begin, end };
}

function mrk(id: string, charIndex: number): TextOffsets {
  return {
    type: "marker",
    body: { id } as Body,
    begin: charIndex,
    end: charIndex,
  };
}

function blk(
  id: string,
  begin: number,
  end: number,
  blockType: string,
): TextOffsets {
  return {
    type: "block",
    body: { id } as Body,
    begin,
    end,
    blockType,
  };
}
