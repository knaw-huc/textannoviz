import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { LineOffsets } from "../AnnotationModel.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";

export function createAnnotationLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliRelativeAnno[],
  type: "annotation" | "highlight",
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );

  // TODO: still +1 needed?
  return {
    type,
    body: annotation.body,
    startChar: relativePosition.start ?? 0,
    endChar: relativePosition.end,
  };
}

/**
 * Mark start of page using end offset
 */
export function createMarkerLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliRelativeAnno[],
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );
  const startChar = relativePosition.start ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    startChar,
    endChar: startChar,
  };
}

function getPositionRelativeToView(
  positionsRelativeToView: BroccoliRelativeAnno[],
  annotation: AnnoRepoAnnotation,
) {
  const positionRelativeToView = positionsRelativeToView.find(
    (p) => p.bodyId === annotation.body.id,
  );
  if (!positionRelativeToView) {
    throw new Error(
      `No relative position found for annotation ${annotation?.body?.id}`,
    );
  }
  return positionRelativeToView;
}
