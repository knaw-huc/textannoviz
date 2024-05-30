import { describe, expect, it } from "vitest";
import { listAnnotationOffsets } from "./listAnnotationOffsets.ts";
import { annotations } from "../test/resources/testLogicalTextAnnotations.ts";

describe("listAnnotationOffsets", () => {
  it("contains all positions in sorted order", () => {
    const result = listAnnotationOffsets(annotations);
    expect(result.map((e) => e.charIndex)).toEqual([2, 4, 6, 8]);
  });

  it("contains positions with multiple offsets", () => {
    const result = listAnnotationOffsets(annotations);
    const secondOffset = result[1];
    const firstOffsetCharIndex = secondOffset.charIndex;
    expect(firstOffsetCharIndex).toEqual(4);

    const annotationsAtSecondOffset = secondOffset.offsets;
    const firstAnnotation = annotationsAtSecondOffset[0];
    expect(firstAnnotation.annotationId).toEqual("anno2");
    expect(firstAnnotation.type).toEqual("start");

    const secondAnnotation = annotationsAtSecondOffset[1];
    expect(secondAnnotation.annotationId).toEqual("anno3");
    expect(secondAnnotation.type).toEqual("start");
  });
});
