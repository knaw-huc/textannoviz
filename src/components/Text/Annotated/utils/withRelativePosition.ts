import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { RelativeTextAnnotation } from "../Model.ts";

export function withRelativePosition(
  annotation: AnnoRepoAnnotation,
  positionsRelativeToView: BroccoliViewPosition[],
  lines: string[],
): RelativeTextAnnotation {
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
    type: annotation.body.type,
    anno: annotation,
    lineIndex: positionRelativeToView.start.line,
    startChar,
    endChar,
  };
}