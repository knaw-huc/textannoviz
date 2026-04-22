import { describe, expect, it } from "vitest";
import {
  body,
  annotations,
} from "../test/resources/dummyLogicalTextAnnotations.ts";
import { Body, NestedSegment, TextOffsets } from "../AnnotationModel.ts";
import { AnnotationSegmenter } from "./AnnotationSegmenter.ts";
import { assignGroupToSegments } from "./assignGroupToSegments.ts";

function segmentAndGroup(text: string, offsets: TextOffsets[]) {
  const segments = new AnnotationSegmenter(text, offsets).segment();
  return assignGroupToSegments(segments);
}

describe("groupSegments", () => {
  it("assigns depth to nested annotations", () => {
    const segments = segmentAndGroup(body, annotations);
    const annotationsIdAndDepth = segments[2].annotations.map((a) => ({
      id: a.body.id,
      depth: (a as NestedSegment).depth,
    }));
    expect(annotationsIdAndDepth).toEqual([
      { id: "anno1", depth: 1 },
      { id: "anno3", depth: 2 },
      { id: "anno2", depth: 3 },
    ]);
  });

  it("creates group with depth=1 and maxDepth=1 for single annotation", () => {
    const segments = segmentAndGroup("aa", [ann("a", 0, 2)]);
    expect(segments.length).toEqual(1);
    const a = segments[0].annotations[0] as NestedSegment;
    expect(a.depth).toEqual(1);
    expect(a.group.maxDepth).toEqual(1);
  });

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const segments = segmentAndGroup("aabbcc", [
      ann("aabbcc", 0, 6),
      ann("bbcc", 2, 6),
      ann("cc", 4, 6),
    ]);
    const abc = segments[0].annotations[0] as NestedSegment;
    expect(abc.body.id).toEqual("aabbcc");
    expect(abc.depth).toEqual(1);
    expect(abc.group.maxDepth).toEqual(3);
  });

  it("creates new group after annotation-less part of text", () => {
    // <a>aa</a>bb<c>cc</c>
    const segments = segmentAndGroup("aabbcc", [
      ann("aa", 0, 2),
      ann("cc", 4, 6),
    ]);
    const aa = segments[0].annotations[0] as NestedSegment;
    expect(aa.group.id).toEqual(1);
    const cc = segments[2].annotations[0] as NestedSegment;
    expect(cc.group.id).toEqual(2);
  });

  it("creates new group when no annotations are overlapping or connected", () => {
    // <aa><bb>
    const segments = segmentAndGroup("aabb", [
      ann("aa", 0, 2),
      ann("bb", 2, 4),
    ]);
    const aa = segments[0].annotations[0] as NestedSegment;
    expect(aa.group.id).toEqual(1);
    const bb = segments[1].annotations[0] as NestedSegment;
    expect(bb.group.id).toEqual(2);
  });

  it("keeps one group when a highlight connects two annotations", () => {
    /**
     * <highlight>
     *   <a>aa</a>
     *   bb
     *   <c>cc</c>
     * </highlight>
     */
    const segments = segmentAndGroup("aabbcc", [
      ann("aa", 0, 2),
      hgl("high", 0, 6),
      ann("cc", 4, 6),
    ]);
    const aa = segments[0].annotations.find(
      (a) => a.type === "nested",
    ) as NestedSegment;
    const cc = segments[2].annotations.find(
      (a) => a.type === "nested",
    ) as NestedSegment;
    expect(aa.group.id).toBe(cc.group.id);
  });

  it("tracks maxDepth for overlapping annotations", () => {
    // <ab>aa<bc>bb</ab><cd>cc</bc>dd</cd>
    const segments = segmentAndGroup("aabbccdd", [
      ann("ab", 0, 4),
      ann("bc", 2, 6),
      ann("cd", 4, 8),
    ]);
    const ab = segments[0].annotations[0] as NestedSegment;
    expect(ab.depth).toEqual(1);
    expect(ab.group.maxDepth).toEqual(3);
  });

  it("resets depth correctly after closing overlapping annotations", () => {
    // <abcde><ab>aa<bc>bb</ab>cc</bc>dd<e>ee</e></abcde>
    const segments = segmentAndGroup("aabbccddee", [
      ann("abcde", 0, 10),
      ann("ab", 0, 4),
      ann("bc", 2, 6),
      ann("e", 8, 10),
    ]);
    const e = segments[4].annotations.find(
      (a) => a.type === "nested" && a.body.id === "e",
    ) as NestedSegment;
    expect(e.depth).toEqual(2);
  });

  it("does not increment group id when a block closes", () => {
    // <p1>aa</p1>bb<e1>cc</e1>
    const segments = segmentAndGroup("aabbcc", [
      blk("p1", 0, 2, "paragraph"),
      ann("e1", 4, 6),
    ]);
    const e1 = segments[2].annotations.find(
      (a) => a.type === "nested",
    ) as NestedSegment;
    expect(e1.group.id).toBe(1);
  });
});

function ann(id: string, beginChar: number, endChar: number): TextOffsets {
  return { type: "nested", body: { id } as Body, beginChar, endChar };
}

function hgl(id: string, beginChar: number, endChar: number): TextOffsets {
  return { type: "highlight", body: { id } as Body, beginChar, endChar };
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
