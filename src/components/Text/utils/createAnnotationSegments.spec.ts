import { describe, expect, it } from "vitest";
import { createAnnotationSegments } from "./createAnnotationSegments.ts";
import {
  line,
  offsetsByCharIndex,
} from "../test/resources/testLogicalTextAnnotations.ts";

describe("createAnnotationSegments", () => {
  it("starts with segment of text without annotations when no annotation found", () => {
    const result = createAnnotationSegments(offsetsByCharIndex, line);
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toBeUndefined();
  });

  it("creates segment of text with annotation", () => {
    const result = createAnnotationSegments(offsetsByCharIndex, line);
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations).toEqual([{ id: "anno1", depth: 1 }]);
  });

  it("creates segment of text with multiple annotations", () => {
    const result = createAnnotationSegments(offsetsByCharIndex, line);
    expect(result[2].body).toEqual("cc");
    expect(result[2].annotations).toEqual([
      { id: "anno1", depth: 1 },
      { id: "anno2", depth: 2 },
      { id: "anno3", depth: 3 },
    ]);
  });

  it("ends with segment of text without annotations when no annotation found", () => {
    const result = createAnnotationSegments(offsetsByCharIndex, line);
    expect(result[4].body).toEqual("ee");
    expect(result[4].annotations).toBeUndefined();
  });

  it("can start with annotation", () => {
    const result = createAnnotationSegments(
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
      "aab",
    );
    expect(result[0].body).toEqual("aa");
    expect(result[0].annotations).toEqual([{ id: "anno1", depth: 1 }]);
    expect(result[1].body).toEqual("b");
    expect(result[1].annotations).toBeUndefined();
  });

  it("can end with annotation", () => {
    const result = createAnnotationSegments(
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
      "abb",
    );
    expect(result[0].body).toEqual("a");
    expect(result[0].annotations).toBeUndefined();
    expect(result[1].body).toEqual("bb");
    expect(result[1].annotations).toEqual([{ id: "anno1", depth: 1 }]);
  });

  it("can handle empty text in between annotations", () => {
    const result = createAnnotationSegments(
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
      "aabbcc",
    );
    expect(result.length).toEqual(3);
    expect(result[0].annotations).toEqual([{ id: "anno1", depth: 1 }]);
    expect(result[1].annotations).toBeUndefined();
    expect(result[2].annotations).toEqual([{ id: "anno2", depth: 1 }]);
  });

  it("passes the max depth within an connected set of annotations", () => {
    // TODO
  });
});
