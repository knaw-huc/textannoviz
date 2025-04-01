import { describe, expect, it } from "vitest";

import { annotations } from "../test/resources/dummyLogicalTextAnnotations.ts";
import { listOffsetsByChar } from "./listOffsetsByChar.ts";

describe("listAnnotationOffsets", () => {
  it("contains all positions in sorted order", () => {
    const result = listOffsetsByChar(annotations);
    expect(result.map((e) => e.charIndex)).toEqual([2, 4, 6, 8]);
  });

  it("contains positions with multiple offsets", () => {
    const result = listOffsetsByChar(annotations);
    const secondOffset = result[1];
    const firstOffsetCharIndex = secondOffset.charIndex;
    expect(firstOffsetCharIndex).toEqual(4);

    const annotationsAtSecondOffset = secondOffset.offsets;
    const firstAnnotation = annotationsAtSecondOffset[0];
    expect(firstAnnotation.body.id).toEqual("anno2");
    expect(firstAnnotation.mark).toEqual("start");

    const secondAnnotation = annotationsAtSecondOffset[1];
    expect(secondAnnotation.body.id).toEqual("anno3");
    expect(secondAnnotation.mark).toEqual("start");
  });
});
