import { describe, expect, it } from "vitest";
import { createAnnotationSegments } from "./createAnnotationSegments.ts";
import {
  line,
  offsetsByCharIndex,
} from "../test/resources/testLogicalTextAnnotations.ts";
import { AnnotationBody, NestedAnnotationSegment } from "../AnnotationModel.ts";

describe("createAnnotationSegments", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex);
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex);
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations!.length).toEqual(1);
    expect(
      (result[1].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(result[1].annotations![0].body.id).toEqual("anno1");
  });

  it("creates segment of text with multiple annotations", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex);
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
    const result = createAnnotationSegments(line, offsetsByCharIndex);
    expect(result[4].body).toEqual("ee");
    expect(result[4].annotations).toEqual([]);
  });

  it("can start with annotation", () => {
    const result = createAnnotationSegments("aab", [
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
    ]);
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
    const result = createAnnotationSegments("abb", [
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
    ]);
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
    const result = createAnnotationSegments("aabbcc", [
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
    ]);
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

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const result = createAnnotationSegments("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "id-aabbcc" } as AnnotationBody,
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
            body: { id: "id-bbcc" } as AnnotationBody,
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
            body: { id: "id-cc" } as AnnotationBody,
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
            body: { id: "id-cc" } as AnnotationBody,
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
            body: { id: "id-cc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "id-bbcc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "id-aabbcc" } as AnnotationBody,
          },
        ],
      },
    ]);

    expect(result.length).toEqual(3);

    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].body.id).toEqual("id-aabbcc");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).depth,
    ).toEqual(1);
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.maxDepth,
    ).toEqual(3);
  });

  it("creates new group after annotation-less part of line", () => {
    // <aa>bb<cc>
    const result = createAnnotationSegments("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "id-aa" } as AnnotationBody,
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
            body: { id: "id-aa" } as AnnotationBody,
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
            body: { id: "id-cc" } as AnnotationBody,
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
            body: { id: "id-cc" } as AnnotationBody,
          },
        ],
      },
    ]);

    expect(result[0].annotations![0].body.id).toEqual("id-aa");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(1);

    expect(result[2].annotations![0].body.id).toEqual("id-cc");
    expect(
      (result[2].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(2);
  });

  it("creates new group when no annotations are not overlapping or connected", () => {
    // <aa><bb>
    const result = createAnnotationSegments("aabb", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "id-aa" } as AnnotationBody,
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
            body: { id: "id-aa" } as AnnotationBody,
          },
          {
            charIndex: 2,
            mark: "start",
            type: "annotation",
            body: { id: "id-bb" } as AnnotationBody,
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
            body: { id: "id-bb" } as AnnotationBody,
          },
        ],
      },
    ]);

    expect(result[0].annotations![0].body.id).toEqual("id-aa");
    expect(
      (result[0].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(1);

    expect(result[1].annotations![0].body.id).toEqual("id-bb");
    expect(
      (result[1].annotations![0] as NestedAnnotationSegment).group.id,
    ).toEqual(2);
  });

  it("sorts annotations by length when starting at the same char index in multiple segments", () => {
    // <abc><ab>aa<bc>bb</ab>cc</abc></bc>
    const result = createAnnotationSegments("aabbcc", [
      {
        charIndex: 0,
        offsets: [
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "id-abc" } as AnnotationBody,
          },
          {
            charIndex: 0,
            mark: "start",
            type: "annotation",
            body: { id: "id-ab" } as AnnotationBody,
          },
        ],
      },
      {
        charIndex: 2,
        offsets: [
          {
            charIndex: 2,
            mark: "start",
            body: { id: "id-bc" } as AnnotationBody,
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
            body: { id: "id-ab" } as AnnotationBody,
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
            body: { id: "id-abc" } as AnnotationBody,
          },
          {
            charIndex: 6,
            mark: "end",
            type: "annotation",
            body: { id: "id-bc" } as AnnotationBody,
          },
        ],
      },
    ]);

    expect(result[0].annotations![1].body.id).toEqual("id-ab");
    expect(
      (result[0].annotations![1] as NestedAnnotationSegment).depth,
    ).toEqual(2);

    expect(result[1].annotations![1].body.id).toEqual("id-ab");
    expect(
      (result[1].annotations![1] as NestedAnnotationSegment).depth,
    ).toEqual(2);
  });
});
