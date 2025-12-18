import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { TextOffsets } from "../AnnotationModel.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";

export function createAnnotationTextOffsets(
  annotation: AnnoRepoAnnotation,
  relativePosition: BroccoliRelativeAnno,
  type: "annotation" | "highlight",
): TextOffsets {
  const result = {
    type,
    body: annotation.body,
    beginChar: relativePosition.begin ?? 0,
    endChar: relativePosition.end,
  };
  if (result.beginChar === result.endChar) {
    throw new Error("Should not be marker");
  }
  return result;
}

/**
 * Mark start of page using end offset
 */
export function createMarkerTextOffsets(
  annotation: AnnoRepoAnnotation,
  relativePosition: BroccoliRelativeAnno,
): TextOffsets {
  const startChar = relativePosition.begin ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    beginChar: startChar,
    endChar: startChar,
  };
}

export function findRelativePosition(
  annotation: AnnoRepoAnnotation,
  relativePositions: BroccoliRelativeAnno[],
): BroccoliRelativeAnno | undefined {
  const found = relativePositions.find((p) => p.bodyId === annotation.body.id);
  if (!found) {
    /**
     * A view does not contain relative positions
     * to all annotations, so this can happen:
     */
    return undefined;
  }
  return found;
}

export type WithRelativePosition = {
  annotation: AnnoRepoAnnotation;
  relative: BroccoliRelativeAnno;
};
