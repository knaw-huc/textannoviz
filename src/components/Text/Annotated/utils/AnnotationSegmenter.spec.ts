import { describe, expect, it } from "vitest";
import {
  line,
  offsetsByCharIndex,
} from "../test/resources/dummyLogicalTextAnnotations.ts";
import { AnnotationBody, NestedAnnotationSegment } from "../AnnotationModel.ts";
import { AnnotationSegmenter } from "./AnnotationSegmenter.ts";

describe("AnnotationSegmenter", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = new AnnotationSegmenter(line, offsetsByCharIndex).segment();
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const result = new AnnotationSegmenter(line, offsetsByCharIndex).segment();
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations!.length).toEqual(1);
    expect(
      (result[1].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(result[1].annotations![0].body.id).toEqual("anno1");
  });

  it("creates segment of text with multiple annotations", () => {
    const result = new AnnotationSegmenter(line, offsetsByCharIndex).segment();
    expect(result[2].body).toEqual("cc");
    const annotationsIdAndDepth = result[2].annotations!.map((a) => ({
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
    const result = new AnnotationSegmenter(line, offsetsByCharIndex).segment();
    expect(result[4].body).toEqual("ee");
    expect(result[4].annotations).toEqual([]);
  });

  it("can start with annotation", () => {
    const result = new AnnotationSegmenter("aab", [
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
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].body.id).toEqual("anno1");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(result[1].body).toEqual("b");
    expect(result[1].annotations).toEqual([]);
  });

  it("can end with annotation", () => {
    const result = new AnnotationSegmenter("abb", [
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
    expect(result[0].body).toEqual("a");
    expect(result[0].annotations).toEqual([]);
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations!.length).toEqual(1);
    expect(result[1].annotations![0].body.id).toEqual("anno1");
    expect(
      (result[1].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
  });

  it("can handle empty text in between annotations", () => {
    // <aa>bb<cc>
    const result = new AnnotationSegmenter("aabbcc", [
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
    expect(result.length).toEqual(3);

    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].body.id).toEqual("anno1");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);

    expect(result[1].annotations).toEqual([]);

    expect(result[2].annotations!.length).toEqual(1);
    expect(result[2].annotations![0].body.id).toEqual("anno2");
    expect(
      (result[2].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
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

    expect(segments[0].annotations!.length).toEqual(1);
    expect(
      (segments[0].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(
      (segments[0].annotations![0] as NestedAnnotationSegment).group.maxDepth,
    ).toEqual(1);
  });

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const result = new AnnotationSegmenter("aabbcc", [
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

    expect(result.length).toEqual(3);

    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].body.id).toEqual("aabbcc");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.maxDepth,
    ).toEqual(3);
  });

  it("creates new group after annotation-less part of line", () => {
    // <aa>bb<cc>
    const result = new AnnotationSegmenter("aabbcc", [
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

    expect(result[0].annotations![0].body.id).toEqual("aa");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(1);

    expect(result[2].annotations![0].body.id).toEqual("cc");
    expect(
      (result[2].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(2);
  });

  it("creates new group when no annotations are not overlapping or connected", () => {
    // <aa><bb>
    const result = new AnnotationSegmenter("aabb", [
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

    expect(result[0].annotations![0].body.id).toEqual("aa");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(1);

    expect(result[1].annotations![0].body.id).toEqual("bb");
    expect(
      (result[1].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(2);
  });

  it("sorts annotations by length when starting at the same char index in multiple segments", () => {
    // <abc><ab>aa<bc>bb</ab>cc</abc></bc>
    const result = new AnnotationSegmenter("aabbcc", [
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

    expect(result[0].annotations![1].body.id).toEqual("ab");
    expect(
      (result[0].annotations![1] as NestedAnnotationSegment).depth,
    ).toEqual(2);

    expect(result[1].annotations![1].body.id).toEqual("ab");
    expect(
      (result[1].annotations![1] as NestedAnnotationSegment).depth,
    ).toEqual(2);
  });

  it("supports two overlapping annotations", () => {
    // <ab>aa<bc>bb</ab><cd>cc</bc>dd</cd>
    const segment = new AnnotationSegmenter("aabbccdd", [
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

    const ab = segment[0].annotations![0] as NestedAnnotationSegment;
    expect(ab.body.id).toEqual("ab");
    expect(ab.depth).toEqual(1);
    expect(ab.group.maxDepth).toEqual(3);
  });

  it("resets depth correctly after closing two overlapping annotations", () => {
    // <abcde><ab>aa<bc>bb</ab>cc</bc>dd<e>ee</e></abcde>
    const segment = new AnnotationSegmenter("aabbccddee", [
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

    const e = segment[4].annotations![1] as NestedAnnotationSegment;
    expect(e.body.id).toEqual("e");
    expect(e.depth).toEqual(2);
  });

  it("sets start and end segment", () => {
    // aa<bc>bbcc</bc>dd
    const segment = new AnnotationSegmenter("aabbccdd", [
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

    const abc = segment[1].annotations![0] as NestedAnnotationSegment;
    expect(abc.body.id).toEqual("bc");
    expect(abc.startSegment).toEqual(1);
    expect(abc.endSegment).toEqual(2);
  });

  it("sets start and end segment when opening and closing at first and last segment", () => {
    // <abc>aabbcc</abc>
    const segment = new AnnotationSegmenter("aabbcc", [
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

    const abc = segment[0].annotations![0] as NestedAnnotationSegment;
    expect(abc.body.id).toEqual("abc");
    expect(abc.startSegment).toEqual(0);
    expect(abc.endSegment).toEqual(1);
  });
});
