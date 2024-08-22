import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { LineOffsets } from "../AnnotationModel.ts";

export function createNestedLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliViewPosition[],
  lines: string[],
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
    type: "annotation",
    body: annotation.body,
    lineIndex: relativePosition.start.line,
    startChar: relativePosition.start.offset ?? 0,
    endChar,
  };
}

/**
 * Mark footnote using start offset
 */
export function createFootnoteMarkLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliViewPosition[],
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );
  const startChar: number = relativePosition.start.offset ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    lineIndex: relativePosition.start.line,
    startChar,
    endChar: startChar,
  };
}

/**
 * Mark end of page using end offset
 */
export function createPageMarkLineOffsets(
  annotation: AnnoRepoAnnotation,
  allRelativePositions: BroccoliViewPosition[],
): LineOffsets {
  const relativePosition = getPositionRelativeToView(
    allRelativePositions,
    annotation,
  );
  const endChar: number = relativePosition.end.offset ?? 0;
  return {
    type: "marker",
    body: annotation.body,
    lineIndex: relativePosition.end.line,
    startChar: endChar,
    endChar,
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
