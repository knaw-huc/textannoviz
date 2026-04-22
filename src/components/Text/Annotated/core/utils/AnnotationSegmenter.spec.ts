import { describe, expect, it } from "vitest";
import {
  body,
  annotations,
} from "../test/resources/dummyLogicalTextAnnotations.ts";
import {
  BlockAnnotationSegment,
  Body,
  MarkerSegment,
  NestedSegment,
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
    expect(segments[1].annotations!.length).toEqual(1);
    const anno1 = segments[1].annotations![0] as NestedSegment;
    expect(anno1.body.id).toEqual("anno1");
    expect(anno1.depth).toEqual(1);
  });

  it("creates segment of text with multiple annotations", () => {
    const segments = new AnnotationSegmenter(body, annotations).segment();
    expect(segments[2].body).toEqual("cc");
    const annotationsIdAndDepth = segments[2].annotations!.map((a) => ({
      id: a.body.id,
      depth: (a as NestedSegment).depth,
    }));
    expect(annotationsIdAndDepth).toEqual([
      { id: "anno1", depth: 1 },
      { id: "anno3", depth: 2 },
      // anno2 is shorter and nested deeper:
      { id: "anno2", depth: 3 },
    ]);
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
    expect(segments[0].annotations!.length).toEqual(1);
    const anno1 = segments[0].annotations![0] as NestedSegment;
    expect(anno1.body.id).toBe("anno1");
    expect(anno1.depth).toBe(1);
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
    expect(segments[1].annotations!.length).toEqual(1);
    const anno1 = segments[1].annotations![0] as NestedSegment;
    expect(anno1.body.id).toEqual("anno1");
    expect(anno1.depth).toEqual(1);
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

    const segment1 = segments[0];
    expect(segment1.annotations!.length).toEqual(1);
    const anno1 = segment1.annotations![0] as NestedSegment;
    expect(anno1.body.id).toEqual("anno1");
    expect(anno1.depth).toEqual(1);

    const segmentWithNoAnnotations = segments[1];
    expect(segmentWithNoAnnotations.body).toEqual("bb");
    expect(segmentWithNoAnnotations.annotations).toEqual([]);

    expect(segments[2].annotations!.length).toEqual(1);
    const anno2 = segments[2].annotations![0] as NestedSegment;
    expect(anno2.body.id).toEqual("anno2");
    expect(anno2.depth).toEqual(1);
  });

  it("creates group for single annotation with depth=1 and maxDepth=1", () => {
    // <a>aa</a>
    const segments = new AnnotationSegmenter("aa", [ann("a", 0, 2)]).segment();

    expect(segments.length).toEqual(1);
    const a = segments[0].annotations![0] as NestedSegment;
    expect(segments[0].annotations!.length).toEqual(1);
    expect(a.depth).toEqual(1);
    expect(a.group.maxDepth).toEqual(1);
  });

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("aabbcc", 0, 6),
      ann("bbcc", 2, 6),
      ann("cc", 4, 6),
    ]).segment();

    expect(segments.length).toEqual(3);
    expect(segments[0].annotations!.length).toEqual(1);

    const abc = segments[0].annotations![0] as NestedSegment;
    expect(abc.body.id).toEqual("aabbcc");
    expect(abc.depth).toEqual(1);
    expect(abc.group.maxDepth).toEqual(3);
  });

  it("creates new group after annotation-less part of text", () => {
    // <a>aa</a>bb<c>cc</c>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("aa", 0, 2),
      ann("cc", 4, 6),
    ]).segment();

    const segment1aa = segments[0].annotations![0] as NestedSegment;
    expect(segment1aa.body.id).toEqual("aa");
    expect(segment1aa.group.id).toEqual(1);

    const segment3cc = segments[2].annotations![0] as NestedSegment;
    expect(segment3cc.body.id).toEqual("cc");
    expect(segment3cc.group.id).toEqual(2);
  });

  it("creates new group when no annotations are overlapping or connected", () => {
    // <aa><bb>
    const segments = new AnnotationSegmenter("aabb", [
      ann("aa", 0, 2),
      ann("bb", 2, 4),
    ]).segment();

    const segment1aa = segments[0].annotations![0] as NestedSegment;
    expect(segment1aa.body.id).toEqual("aa");
    expect(segment1aa.group.id).toEqual(1);

    const segment2bb = segments[1].annotations![0] as NestedSegment;
    expect(segment2bb.body.id).toEqual("bb");
    expect(segment2bb.group.id).toEqual(2);
  });

  it("creates two groups when a highlight connects two annotations", () => {
    /**
     * <highlight> --> does not belong to groups
     *   <a>aa</a> --> group 1
     *   bb
     *   <c>cc</c> --> group 2
     * </highlight>
     */
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("aa", 0, 2),
      hi("high", 0, 6),
      ann("cc", 4, 6),
    ]).segment();

    const segment1high = segments[0].annotations![1] as NestedSegment;
    expect(segment1high.group.id).toEqual(1);

    const segment3cc = segments[2].annotations![1] as NestedSegment;
    expect(segment3cc.group.id).toEqual(2);
  });

  it("sorts annotations by length when starting at the same char index", () => {
    // <abc><ab>aa<bc>bb</ab>cc</abc></bc>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("abc", 0, 6),
      ann("ab", 0, 4),
      ann("bc", 2, 6),
    ]).segment();

    // ab is shorter than abc:
    const segment1ab = segments[0].annotations![1] as NestedSegment;
    expect(segment1ab.body.id).toEqual("ab");
    expect(segment1ab.depth).toEqual(2);

    // ab keeps depth across segments:
    const segment2ab = segments[1].annotations![1] as NestedSegment;
    expect(segment2ab.body.id).toEqual("ab");
    expect(segment2ab.depth).toEqual(2);
  });

  it("supports two overlapping annotations", () => {
    // <ab>aa<bc>bb</ab><cd>cc</bc>dd</cd>
    const segments = new AnnotationSegmenter("aabbccdd", [
      ann("ab", 0, 4),
      ann("bc", 2, 6),
      ann("cd", 4, 8),
    ]).segment();

    const ab = segments[0].annotations![0] as NestedSegment;
    expect(ab.body.id).toEqual("ab");
    expect(ab.depth).toEqual(1);
    expect(ab.group.maxDepth).toEqual(3);
  });

  it("resets depth correctly after closing two overlapping annotations", () => {
    // <abcde><ab>aa<bc>bb</ab>cc</bc>dd<e>ee</e></abcde>
    const segments = new AnnotationSegmenter("aabbccddee", [
      ann("abcde", 0, 10),
      ann("ab", 0, 4),
      ann("bc", 2, 6),
      ann("e", 8, 10),
    ]).segment();

    const e = segments[4].annotations![1] as NestedSegment;
    expect(e.body.id).toEqual("e");
    expect(e.depth).toEqual(2);
  });

  it("sets start and end segment", () => {
    // aa<bc>bbcc</bc>dd
    const segments = new AnnotationSegmenter("aabbccdd", [
      ann("bc", 2, 6),
    ]).segment();

    const abc = segments[1].annotations![0] as NestedSegment;
    expect(abc.body.id).toEqual("bc");
    expect(abc.startSegment).toEqual(1);
    expect(abc.endSegment).toEqual(2);
  });

  it("sets start and end segment when opening and closing at first and last segment", () => {
    // <abc>aabbcc</abc>
    const segments = new AnnotationSegmenter("aabbcc", [
      ann("abc", 0, 6),
    ]).segment();

    const abc = segments[0].annotations![0] as NestedSegment;
    expect(abc.body.id).toEqual("abc");
    expect(abc.startSegment).toEqual(0);
    expect(abc.endSegment).toEqual(1);
  });

  it("creates empty note marker segment with endSegment equal to startSegment", () => {
    // aa*bb
    const segments = new AnnotationSegmenter("aabb", [
      mk("urn:foo:ptr:1", 2),
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
      mk("marker1", 1),
    ]).segment();
    expect(segments.length).toEqual(3);
    expect(segments[1].body).toEqual("");
    expect(segments[1].annotations.length).toEqual(1);
    expect(segments[1].annotations[0].type).toEqual("marker");
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("can contain bodiless marker after last char", () => {
    // a[marker1]
    const segments = new AnnotationSegmenter("a", [mk("marker1", 1)]).segment();
    expect(segments.length).toEqual(2);
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("creates one text segment when empty text contains marker", () => {
    // [marker1]
    const segments = new AnnotationSegmenter("", [mk("marker1", 0)]).segment();
    expect(segments.length).toEqual(1);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
  });

  it("creates two text segments when single space contains marker at char 0", () => {
    // [marker1]<space>
    const segments = new AnnotationSegmenter(" ", [mk("marker1", 0)]).segment();
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
      hi("id2", 13, 100),
      mk("id3", 13),
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
      mk("m1", 2),
      hi("h1", 4, 6),
    ]).segment();
    expect(segments.length).toBe(4);
    expect(segments[0].body).toBe("aa");
    expect(segments[0].annotations[0].type).toBe("annotation");
    expect(segments[1].body).toBe("");
    expect(segments[1].annotations[0].type).toBe("marker");
    expect(segments[2].body).toBe("bb");
    expect(segments[3].body).toBe("cc");
    expect(segments[3].annotations[0].type).toBe("highlight");
  });
});

function ann(id: string, beginChar: number, endChar: number): TextOffsets {
  return { type: "annotation", body: { id } as Body, beginChar, endChar };
}

function hi(id: string, beginChar: number, endChar: number): TextOffsets {
  return { type: "highlight", body: { id } as Body, beginChar, endChar };
}

function mk(id: string, charIndex: number): TextOffsets {
  return {
    type: "marker",
    body: { id } as Body,
    beginChar: charIndex,
    endChar: charIndex,
  };
}

function blk(
  id: string,
  beginChar: number,
  endChar: number,
  blockType: string,
): TextOffsets {
  return {
    type: "block",
    body: { id } as Body,
    beginChar,
    endChar,
    blockType,
  };
}
