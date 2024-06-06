import { describe, expect, it } from "vitest";
import { createAnnotationSegments } from "./createAnnotationSegments.ts";
import {
  line,
  offsetsByCharIndex,
} from "../test/resources/testLogicalTextAnnotations.ts";

describe("createAnnotationSegments", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex, []);
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([]);
  });

  it("creates segment of text with annotation", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex, []);
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations!.length).toEqual(1);
    expect(result[1].annotations![0].depth).toEqual(1);
    expect(result[1].annotations![0].id).toEqual("anno1");
  });

  it("creates segment of text with multiple annotations", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex, []);
    expect(result[2].body).toEqual("cc");
    const annotationsIdAndDepth = result[2].annotations!.map((a) => ({
      id: a.id,
      depth: a.depth,
    }));
    expect(annotationsIdAndDepth).toEqual([
      { id: "anno1", depth: 1 },
      { id: "anno2", depth: 2 },
      { id: "anno3", depth: 3 },
    ]);
  });

  it("ends with segment of text without annotations when no annotation found", () => {
    const result = createAnnotationSegments(line, offsetsByCharIndex, []);
    expect(result[4].body).toEqual("ee");
    expect(result[4].annotations).toEqual([]);
  });

  it("can start with annotation", () => {
    const result = createAnnotationSegments(
      "aab",
      [
        {
          charIndex: 0,
          offsets: [
            {
              charIndex: 0,
              type: "start",
              annotationId: "anno1",
            },
          ],
        },
        {
          charIndex: 2,
          offsets: [
            {
              charIndex: 2,
              type: "end",
              annotationId: "anno1",
            },
          ],
        },
      ],
      [],
    );
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].id).toEqual("anno1");
    expect(result[0].annotations![0].depth).toEqual(1);
    expect(result[1].body).toEqual("b");
    expect(result[1].annotations).toEqual([]);
  });

  it("can end with annotation", () => {
    const result = createAnnotationSegments(
      "abb",
      [
        {
          charIndex: 1,
          offsets: [
            {
              charIndex: 1,
              type: "start",
              annotationId: "anno1",
            },
          ],
        },
        {
          charIndex: 3,
          offsets: [
            {
              charIndex: 3,
              type: "end",
              annotationId: "anno1",
            },
          ],
        },
      ],
      [],
    );
    expect(result[0].body).toEqual("a");
    expect(result[0].annotations).toEqual([]);
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations!.length).toEqual(1);
    expect(result[1].annotations![0].id).toEqual("anno1");
    expect(result[1].annotations![0].depth).toEqual(1);
  });

  it("can handle empty text in between annotations", () => {
    // <aa>bb<cc>
    const result = createAnnotationSegments(
      "aabbcc",
      [
        {
          charIndex: 0,
          offsets: [
            {
              charIndex: 0,
              type: "start",
              annotationId: "anno1",
            },
          ],
        },
        {
          charIndex: 2,
          offsets: [
            {
              charIndex: 2,
              type: "end",
              annotationId: "anno1",
            },
          ],
        },
        {
          charIndex: 4,
          offsets: [
            {
              charIndex: 4,
              type: "start",
              annotationId: "anno2",
            },
          ],
        },
        {
          charIndex: 6,
          offsets: [
            {
              charIndex: 6,
              type: "end",
              annotationId: "anno2",
            },
          ],
        },
      ],
      [],
    );
    expect(result.length).toEqual(3);

    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].id).toEqual("anno1");
    expect(result[0].annotations![0].depth).toEqual(1);

    expect(result[1].annotations).toEqual([]);

    expect(result[2].annotations!.length).toEqual(1);
    expect(result[2].annotations![0].id).toEqual("anno2");
    expect(result[2].annotations![0].depth).toEqual(1);
  });

  it("shares maximum annotation depth with group of connected annotations", () => {
    // <aa<bb<cc>>>
    const result = createAnnotationSegments(
      "aabbcc",
      [
        {
          charIndex: 0,
          offsets: [
            {
              charIndex: 0,
              type: "start",
              annotationId: "id-aabbcc",
            },
          ],
        },
        {
          charIndex: 2,
          offsets: [
            {
              charIndex: 2,
              type: "start",
              annotationId: "id-bbcc",
            },
          ],
        },
        {
          charIndex: 4,
          offsets: [
            {
              charIndex: 4,
              type: "start",
              annotationId: "id-cc",
            },
          ],
        },

        {
          charIndex: 6,
          offsets: [
            {
              charIndex: 6,
              type: "end",
              annotationId: "id-cc",
            },
          ],
        },
        {
          charIndex: 6,
          offsets: [
            {
              charIndex: 6,
              type: "end",
              annotationId: "id-cc",
            },
            {
              charIndex: 6,
              type: "end",
              annotationId: "id-bbcc",
            },
            {
              charIndex: 6,
              type: "end",
              annotationId: "id-aabbcc",
            },
          ],
        },
      ],
      [],
    );

    expect(result.length).toEqual(3);

    expect(result[0].annotations!.length).toEqual(1);
    expect(result[0].annotations![0].id).toEqual("id-aabbcc");
    expect(result[0].annotations![0].depth).toEqual(1);
    expect(result[0].annotations![0].group.maxDepth).toEqual(3);
  });

  it("creates new group after annotation-less part of line", () => {
    // <aa>bb<cc>
    const result = createAnnotationSegments(
      "aabbcc",
      [
        {
          charIndex: 0,
          offsets: [
            {
              charIndex: 0,
              type: "start",
              annotationId: "id-aa",
            },
          ],
        },
        {
          charIndex: 2,
          offsets: [
            {
              charIndex: 2,
              type: "end",
              annotationId: "id-aa",
            },
          ],
        },
        {
          charIndex: 4,
          offsets: [
            {
              charIndex: 4,
              type: "start",
              annotationId: "id-cc",
            },
          ],
        },
        {
          charIndex: 6,
          offsets: [
            {
              charIndex: 6,
              type: "end",
              annotationId: "id-cc",
            },
          ],
        },
      ],
      [],
    );

    expect(result[0].annotations![0].id).toEqual("id-aa");
    expect(result[0].annotations![0].group.id).toEqual(1);

    expect(result[2].annotations![0].id).toEqual("id-cc");
    expect(result[2].annotations![0].group.id).toEqual(2);
  });

  it("creates new group when no annotations are not overlapping or connected", () => {
    // <aa><bb>
    const result = createAnnotationSegments(
      "aabb",
      [
        {
          charIndex: 0,
          offsets: [
            {
              charIndex: 0,
              type: "start",
              annotationId: "id-aa",
            },
          ],
        },
        {
          charIndex: 2,
          offsets: [
            {
              charIndex: 2,
              type: "end",
              annotationId: "id-aa",
            },
            {
              charIndex: 2,
              type: "start",
              annotationId: "id-bb",
            },
          ],
        },
        {
          charIndex: 4,
          offsets: [
            {
              charIndex: 4,
              type: "end",
              annotationId: "id-bb",
            },
          ],
        },
      ],
      [],
    );

    expect(result[0].annotations![0].id).toEqual("id-aa");
    expect(result[0].annotations![0].group.id).toEqual(1);

    expect(result[1].annotations![0].id).toEqual("id-bb");
    expect(result[1].annotations![0].group.id).toEqual(2);
  });
});
