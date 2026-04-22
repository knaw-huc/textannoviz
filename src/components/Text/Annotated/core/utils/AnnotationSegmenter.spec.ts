import { describe, expect, it } from "vitest";
import {
  body,
  annotations,
} from "../test/resources/dummyLogicalTextAnnotations.ts";
import {
  BlockAnnotationSegment,
  Body,
  MarkerSegment,
  GrouplessNestedSegment,
  TextOffsets,
} from "../AnnotationModel.ts";
import { AnnotationSegmenter } from "./AnnotationSegmenter.ts";

describe("AnnotationSegmenter", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = new AnnotationSegmenter(body, annotations).segment();
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const segments = new AnnotationSegmenter(body, annotations).segment();
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].body.id).toEqual("anno1");
  });

  it("creates segment of text with multiple annotations in size order", () => {
    const segments = new AnnotationSegmenter(body, annotations).segment();
    expect(segments[2].body).toEqual("cc");
    const ids = segments[2].annotations.map((a) => a.body.id);
    expect(ids).toEqual(["anno1", "anno3", "anno2"]);
  });

  it("ends with segment of text without annotations when no annotation found", () => {
    const segments = new AnnotationSegmenter(body, annotations).segment();
    expect(segments[4].body).toEqual("ee");
    expect(segments[4].annotations).toEqual([]);
  });

  it("can start with and end without annotation", () => {
    // <anno1>aa</anno1>b
    const segments = new AnnotationSegmenter("aab", [
      ann("anno1", 0, 2),
    ]).segment();
    expect(segments[0].body).toEqual("aa");
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toBe("anno1");
    expect(segments[1].body).toBe("b");
    expect(segments[1].annotations).toEqual([]);
  });

  it("can start without and end with annotation", () => {
    // a<anno1>bb</anno1>
    const segments = new AnnotationSegmenter("abb", [
      ann("anno1", 1, 3),
    ]).segment();
    expect(segments[0].body).toEqual("a");
    expect(segments[0].annotations).toEqual([]);
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].body.id).toEqual("anno1");
  });

  it("can contain no annotations", () => {
    const segments = new AnnotationSegmenter("a", []).segment();
    expect(segments.length).toEqual(1);
    expect(segments[0].body).toEqual("a");
    expect(segments[0].annotations).toEqual([]);
  });

  it("keeps annotationless text in between annotations", () => {
    // <aa>bb<cc>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("anno1", 0, 2),
      ann("anno2", 4, 6),
    ]).segment();
    expect(segments.length).toEqual(3);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("anno1");
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations).toEqual([]);
    expect(segments[2].annotations.length).toEqual(1);
    expect(segments[2].annotations[0].body.id).toEqual("anno2");
  });

  it("sorts annotations by length when starting at the same char index", () => {
    // <abc><ab>aa<bc>bb</ab>cc</abc></bc>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("abc", 0, 6),
      ann("ab", 0, 4),
      ann("bc", 2, 6),
    ]).segment();

    expect(segments[0].annotations[0].body.id).toEqual("abc");
    expect(segments[0].annotations[1].body.id).toEqual("ab");
    expect(segments[1].annotations[1].body.id).toEqual("ab");
  });

  it("sets start and end segment", () => {
    // aa<bc>bbcc</bc>dd
    const segments = new AnnotationSegmenter("aabbccdd", [
      ann("bc", 2, 6),
    ]).segment();

    const bc = segments[1].annotations[0] as GrouplessNestedSegment;
    expect(bc.body.id).toEqual("bc");
    expect(bc.startSegment).toEqual(1);
    expect(bc.endSegment).toEqual(2);
  });

  it("sets start and end segment when opening and closing at first and last segment", () => {
    // <abc>aabbcc</abc>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("abc", 0, 6),
    ]).segment();

    const abc = segments[0].annotations[0] as GrouplessNestedSegment;
    expect(abc.body.id).toEqual("abc");
    expect(abc.startSegment).toEqual(0);
    expect(abc.endSegment).toEqual(1);
  });

  it("creates empty note marker segment with endSegment equal to startSegment", () => {
    // aa*bb
    const segments = new AnnotationSegmenter("aabb", [
      mrk("urn:foo:ptr:1", 2),
    ]).segment();
    expect(segments.length).toBe(3);
    const markerSegment = segments[1];
    expect(markerSegment.body).toEqual("");
    expect(markerSegment.annotations.length).toBe(1);
    const marker = markerSegment.annotations[0] as MarkerSegment;
    expect(marker.body.id).toEqual("urn:foo:ptr:1");
  });

  it("can contain bodiless marker", () => {
    // a[marker1]b
    const segments = new AnnotationSegmenter("ab", [
      mrk("marker1", 1),
    ]).segment();
    expect(segments.length).toEqual(3);
    expect(segments[1].body).toEqual("");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].type).toEqual("marker");
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("can contain bodiless marker after last char", () => {
    // a[marker1]
    const segments = new AnnotationSegmenter("a", [
      mrk("marker1", 1),
    ]).segment();
    expect(segments.length).toEqual(2);
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("creates one text segment when empty text contains marker", () => {
    // [marker1]
    const segments = new AnnotationSegmenter("", [mrk("marker1", 0)]).segment();
    expect(segments.length).toEqual(1);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
  });

  it("creates two text segments when single space contains marker at char 0", () => {
    // [marker1]<space>
    const segments = new AnnotationSegmenter(" ", [
      mrk("marker1", 0),
    ]).segment();
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
    const segments = new AnnotationSegmenter(text, [
      ann("id1", 13, 16),
      hgl("id2", 13, 100),
      mrk("id3", 13),
    ]).segment();
    const segmentWithMarker = segments[1];
    expect(segmentWithMarker.index).toBe(1);
    const segmentAfterMarker = segments[2];
    expect(segmentAfterMarker.index).toBe(2);
  });

  it("creates block annotation segment", () => {
    const segments = new AnnotationSegmenter("aabb", [
      blk("b1", 0, 4, "paragraph"),
    ]).segment();
    expect(segments.length).toBe(1);
    expect(segments[0].annotations.length).toBe(1);
    const b = segments[0].annotations[0] as BlockAnnotationSegment;
    expect(b.type).toBe("block");
    expect(b.body.id).toBe("b1");
    expect(b.blockType).toBe("paragraph");
  });

  it("creates segments with mixed annotation types", () => {
    // <anno>aa[marker]bb</anno><highlight>cc</highlight>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("a1", 0, 4),
      mrk("m1", 2),
      hgl("h1", 4, 6),
    ]).segment();
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
    // <a>aa</a>bb
    const segments = new AnnotationSegmenter("aabb", [
      ann("a1", 0, 2),
    ]).segment();
    expect(segments[0].index).toBe(0);
    expect(segments[1].index).toBe(1);
  });

  it("keeps (block) annotation order in place", () => {
    // <section><p>aa</p></section>
    const segments = new AnnotationSegmenter("aa", [
      blk("s1", 0, 2, "section"),
      blk("p1", 0, 2, "p"),
    ]).segment();

    const blocks = segments[0].annotations.filter(
      (a) => a.type === "block",
    ) as BlockAnnotationSegment[];

    expect(blocks[0].body.id).toBe("s1");
    expect(blocks[1].body.id).toBe("p1");
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
