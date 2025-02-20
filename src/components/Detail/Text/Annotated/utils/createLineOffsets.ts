import * as _ from "lodash";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { LineOffsets } from "../AnnotationModel.ts";

export function createAnnotationLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliViewPosition[],
  lines: string[],
  type: "annotation" | "highlight",
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );

  let endChar;
  if (_.has(relativePosition.end, "offset")) {
    endChar = relativePosition.end.offset! + 1;
  } else {
    endChar = lines[relativePosition.end.line].length;
  }

  return {
    type,
    body: annotation.body,
    lineIndex: relativePosition.start.line,
    startChar: relativePosition.start.offset ?? 0,
    endChar,
  };
}

/**
 * Mark start of page using end offset
 */
export function createMarkerLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliViewPosition[],
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );
  const startChar = relativePosition.start.offset ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    lineIndex: relativePosition.start.line,
    startChar,
    endChar: startChar,
  };
}

function getPositionRelativeToView(
  positionsRelativeToView: BroccoliViewPosition[],
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
