import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { LineOffsets } from "../AnnotationModel.ts";

export function createLineOffsets(
  annotation: AnnoRepoAnnotation,
  positionsRelativeToView: BroccoliViewPosition[],
  lines: string[],
  markers: string[],
): LineOffsets {
  const positionRelativeToView = positionsRelativeToView.find(
    (p) => p.bodyId === annotation.body.id,
  );
  if (!positionRelativeToView) {
    throw new Error(
      `No relative position found for annotation ${annotation?.body?.id}`,
    );
  }
  const isMarker = markers.includes(annotation.body.type);
  if (
    !isMarker &&
    positionRelativeToView.start.line !== positionRelativeToView.end.line
  ) {
    throw new Error(`Annotation spans multiple lines: ${annotation.body.id}`);
  }
  const startChar: number = _.has(positionRelativeToView.start, "offset")
    ? positionRelativeToView.start.offset!
    : 0;
  let endChar: number;

  if (isMarker) {
    endChar = startChar;
  } else if (_.has(positionRelativeToView.end, "offset")) {
    endChar = positionRelativeToView.end.offset! + 1;
  } else {
    endChar = lines[positionRelativeToView.end.line].length;
  }

  return {
    type: isMarker ? "marker" : "annotation",
    body: annotation.body,
    lineIndex: positionRelativeToView.start.line,
    startChar,
    endChar,
  };
}
