import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { LineOffsets } from "../AnnotationModel.ts";

export function createLineOffsets(
  annotation: AnnoRepoAnnotation,
  positionsRelativeToView: BroccoliViewPosition[],
  lines: string[],
): LineOffsets {
  const positionRelativeToView = positionsRelativeToView.find(
    (p) => p.bodyId === annotation.body.id,
  );
  if (!positionRelativeToView) {
    throw new Error(`Position not found of ${annotation}`);
  }
  if (positionRelativeToView.start.line !== positionRelativeToView.end.line) {
    throw new Error(`Annotation spans multiple lines: ${annotation.body.id}`);
  }
  const startChar: number = _.has(positionRelativeToView.start, "offset")
    ? positionRelativeToView.start.offset!
    : 0;
  const endChar: number = _.has(positionRelativeToView.end, "offset")
    ? positionRelativeToView.end.offset! + 1
    : lines[positionRelativeToView.end.line].length;
  return {
    type: "annotation",
    body: annotation.body,
    lineIndex: positionRelativeToView.start.line,
    startChar,
    endChar,
  };
}
