import { describe, expect, it } from "vitest";
import {
  line,
  offsetsByCharIndex,
} from "../test/resources/dummyLogicalTextAnnotations.ts";
import {
  AnnotationBody,
  MarkerSegment,
  NestedAnnotationSegment,
} from "../AnnotationModel.ts";
import { AnnotationSegmenter } from "./AnnotationSegmenter.ts";

describe("AnnotationSegmenter", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = new AnnotationSegmenter(line, offsetsByCharIndex).segment();
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const segments = new AnnotationSegmenter(
      line,
      offsetsByCharIndex,
    ).segment();

    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations!.length).toEqual(1);
    const anno1 = segments[1].annotations![0] as NestedAnnotationSegment;
    expect(anno1.body.id).toEqual("anno1");
    expect(anno1.depth).toEqual(1);
  });

  it("creates segment of text with multiple annotations", () => {
    const segments = new AnnotationSegmenter(
      line,
      offsetsByCharIndex,
    ).segment();
    expect(segments[2].body).toEqual("cc");
    const annotationsIdAndDepth = segments[2].annotations!.map((a) => ({
      id: a.body.id,
      depth: (a as NestedAnnotationSegment).depth,
    }));
    expect(annotationsIdAndDepth).toEqual([
      { id: "anno1", depth: 1 },
      { id: "anno3", depth: 2 },
      // anno2 is shorter and nested deeper:
      { id: "anno2", depth: 3 },
    ]);
  });

  it("ends with segment of text without annotations when no annotation found", () => {
    const segments = new AnnotationSegmenter(
      line,
      offsetsByCharIndex,
    ).segment();
    expect(segments[4].body).toEqual("ee");
    expect(segments[4].annotations).toEqual([]);
  });

  it("can start with and end without annotation", () => {
    // <anno1>aa</anno1>b
    const segments = new AnnotationSegmenter("aab", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments[0].body).toEqual("aa");
    expect(segments[0].annotations!.length).toEqual(1);
    const anno1 = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(anno1.body.id).toBe("anno1");
    expect(anno1.depth).toBe(1);
    expect(segments[1].body).toBe("b");
    expect(segments[1].annotations).toEqual([]);
  });

  it("can start without and end with annotation", () => {
    // a<anno1>bb</anno1>
    const segments = new AnnotationSegmenter("abb", [
      {
        charIndex: 1,
        offsets: [
          {
            charIndex: 1,
            mark: "start",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 3,
        offsets: [
          {
            charIndex: 3,
            mark: "end",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments[0].body).toEqual("a");
    expect(segments[0].annotations).toEqual([]);
    expect(segments[1].body).toEqual("bb");
    expect(segments[1].annotations!.length).toEqual(1);
    const anno1 = segments[1].annotations![0] as NestedAnnotationSegment;
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
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "start",
            type: "annotation",
            body: { id: "anno2" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "anno2" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments.length).toEqual(3);

    const segment1 = segments[0];
    expect(segment1.annotations!.length).toEqual(1);
    const anno1 = segment1.annotations![0] as NestedAnnotationSegment;
    expect(anno1.body.id).toEqual("anno1");
    expect(anno1.depth).toEqual(1);

    const segmentWithNoAnnotations = segments[1];
    expect(segmentWithNoAnnotations.body).toEqual("bb");
    expect(segmentWithNoAnnotations.annotations).toEqual([]);

    expect(segments[2].annotations!.length).toEqual(1);
    const anno2 = segments[2].annotations![0] as NestedAnnotationSegment;
    expect(anno2.body.id).toEqual("anno2");
    expect(anno2.depth).toEqual(1);
  });

  it("creates group for single annotation with depth=1 and maxDepth=1", () => {
    // <a>aa</a>
    const segments = new AnnotationSegmenter("aa", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "a" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "a" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    expect(segments.length).toEqual(1);
    const a = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(segments[0].annotations!.length).toEqual(1);
    expect(a.depth).toEqual(1);
    expect(a.group.maxDepth).toEqual(1);
  });

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const segments = new AnnotationSegmenter("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "aabbcc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "bbcc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "start",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "bbcc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "aabbcc" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    expect(segments.length).toEqual(3);
    expect(segments[0].annotations!.length).toEqual(1);

    const abc = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(abc.body.id).toEqual("aabbcc");
    expect(abc.depth).toEqual(1);
    expect(abc.group.maxDepth).toEqual(3);
  });

  it("creates new group after annotation-less part of line", () => {
    // <a>aa</a>bb<c>cc</c>
    const segments = new AnnotationSegmenter("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "start",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const segment1aa = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(segment1aa.body.id).toEqual("aa");
    expect(segment1aa.group.id).toEqual(1);

    const segment3cc = segments[2].annotations![0] as NestedAnnotationSegment;
    expect(segment3cc.body.id).toEqual("cc");
    expect(segment3cc.group.id).toEqual(2);
  });

  it("creates new group when no annotations are overlapping or connected", () => {
    // <aa><bb>
    const segments = new AnnotationSegmenter("aabb", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "bb" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "end",
            type: "annotation",
            body: { id: "bb" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const segment1aa = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(segment1aa.body.id).toEqual("aa");
    expect(segment1aa.group.id).toEqual(1);

    const segment2bb = segments[1].annotations![0] as NestedAnnotationSegment;
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
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
          {
            charIndex: 0,
            mark: "start",
            type: "highlight",
            body: {
              id: "high",
            } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "end",
            type: "annotation",
            body: { id: "aa" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "start",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "cc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "highlight",
            body: {
              id: "high",
            } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const segment1high = segments[0].annotations![1] as NestedAnnotationSegment;
    expect(segment1high.group.id).toEqual(1);

    const segment3cc = segments[2].annotations![1] as NestedAnnotationSegment;
    expect(segment3cc.group.id).toEqual(2);
  });

  it("sorts annotations by length when starting at the same char index", () => {
    // <abc><ab>aa<bc>bb</ab>cc</abc></bc>
    const segments = new AnnotationSegmenter("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "abc" } as AnnotationBody,
          },
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            body: { id: "bc" } as AnnotationBody,
            type: "annotation",
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "end",
            type: "annotation",
            body: { id: "ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "abc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    // ab is shorter than abc:
    const segment1ab = segments[0].annotations![1] as NestedAnnotationSegment;
    expect(segment1ab.body.id).toEqual("ab");
    expect(segment1ab.depth).toEqual(2);

    // ab keeps depth across segments:
    const segment2ab = segments[1].annotations![1] as NestedAnnotationSegment;
    expect(segment2ab.body.id).toEqual("ab");
    expect(segment2ab.depth).toEqual(2);
  });

  it("supports two overlapping annotations", () => {
    // <ab>aa<bc>bb</ab><cd>cc</bc>dd</cd>
    const segments = new AnnotationSegmenter("aabbccdd", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "end",
            body: { id: "ab" } as AnnotationBody,
            type: "annotation",
          },
          {
            charIndex: 4,
            mark: "start",
            body: { id: "cd" } as AnnotationBody,
            type: "annotation",
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 8,
        offsets: [
          {
            charIndex: 8,
            mark: "end",
            type: "annotation",
            body: { id: "cd" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const ab = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(ab.body.id).toEqual("ab");
    expect(ab.depth).toEqual(1);
    expect(ab.group.maxDepth).toEqual(3);
  });

  it("resets depth correctly after closing two overlapping annotations", () => {
    // <abcde><ab>aa<bc>bb</ab>cc</bc>dd<e>ee</e></abcde>
    const segments = new AnnotationSegmenter("aabbccddee", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "abcde" } as AnnotationBody,
          },
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 4,
        offsets: [
          {
            charIndex: 4,
            mark: "end",
            type: "annotation",
            body: { id: "ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 8,
        offsets: [
          {
            charIndex: 8,
            mark: "start",
            type: "annotation",
            body: { id: "e" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 10,
        offsets: [
          {
            charIndex: 10,
            mark: "end",
            type: "annotation",
            body: { id: "e" } as AnnotationBody,
          },
          {
            charIndex: 10,
            mark: "end",
            type: "annotation",
            body: { id: "abcde" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const e = segments[4].annotations![1] as NestedAnnotationSegment;
    expect(e.body.id).toEqual("e");
    expect(e.depth).toEqual(2);
  });

  it("sets start and end segment", () => {
    // aa<bc>bbcc</bc>dd
    const segments = new AnnotationSegmenter("aabbccdd", [
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "bc" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const abc = segments[1].annotations![0] as NestedAnnotationSegment;
    expect(abc.body.id).toEqual("bc");
    expect(abc.startSegment).toEqual(1);
    expect(abc.endSegment).toEqual(2);
  });

  it("sets start and end segment when opening and closing at first and last segment", () => {
    // <abc>aabbcc</abc>
    const segments = new AnnotationSegmenter("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "abc" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 6,
        offsets: [
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "abc" } as AnnotationBody,
          },
        ],
      },
    ]).segment();

    const abc = segments[0].annotations![0] as NestedAnnotationSegment;
    expect(abc.body.id).toEqual("abc");
    expect(abc.startSegment).toEqual(0);
    expect(abc.endSegment).toEqual(1);
  });

  it("creates empty note marker segment with endSegment equal to startSegment", () => {
    // aa*bb
    const segments = new AnnotationSegmenter("aabb", [
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            type: "marker",
            body: {
              id: "urn:foo:ptr:1",
              type: "tei:Ptr",
              "tf:textfabricNode": "1",
              metadata: {},
            },
          },
          {
            charIndex: 2,
            mark: "end",
            type: "marker",
            body: {
              id: "urn:foo:ptr:1",
              type: "tei:Ptr",
              "tf:textfabricNode": "1",
              metadata: {},
            },
          },
        ],
      },
    ]).segment();
    expect(segments.length).toBe(3);
    const markerSegment = segments[1];
    expect(markerSegment.body).toEqual("");
    expect(markerSegment.annotations.length).toBe(1);
    const marker = markerSegment.annotations[0] as MarkerSegment;
    expect(marker.body.type).toEqual("tei:Ptr");
    expect(marker.body.id).toEqual("urn:foo:ptr:1");
  });

  it("can contain bodiless marker", () => {
    // a[marker1]b
    const segments = new AnnotationSegmenter("ab", [
      {
        charIndex: 1,
        offsets: [
          {
            charIndex: 1,
            mark: "start",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 1,
        offsets: [
          {
            charIndex: 1,
            mark: "end",
            type: "marker",
            body: { id: "anno1" } as AnnotationBody,
          },
        ],
      },
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
      {
        charIndex: 1,
        offsets: [
          {
            charIndex: 1,
            mark: "start",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 1,
        offsets: [
          {
            charIndex: 1,
            mark: "end",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments.length).toEqual(2);
    expect(segments[1].annotations[0].body.id).toEqual("marker1");
  });

  it("creates one line segment when empty line contains marker", () => {
    // [marker1]
    const segments = new AnnotationSegmenter("", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "end",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments.length).toEqual(1);
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
  });

  it("creates two line segments when single space contains marker at char 0", () => {
    // [marker1]<space>
    const segments = new AnnotationSegmenter(" ", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "end",
            type: "marker",
            body: { id: "marker1" } as AnnotationBody,
          },
        ],
      },
    ]).segment();
    expect(segments.length).toEqual(2);
    expect(segments[0].body).toBe("");
    expect(segments[0].annotations.length).toEqual(1);
    expect(segments[0].annotations[0].body.id).toEqual("marker1");
    expect(segments[1].body).toBe(" ");
    expect(segments[1].annotations.length).toEqual(0);
  });
});
