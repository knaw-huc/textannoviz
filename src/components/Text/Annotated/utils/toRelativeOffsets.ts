import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import * as _ from "lodash";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { AnnotationOffsets } from "../Model.ts";

export function toRelativeOffsets(
  annotation: AnnoRepoAnnotation,
  positionsRelativeToView: BroccoliViewPosition[],
  lines: string[],
): AnnotationOffsets {
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
    id: annotation.body.id,
    category: annotation.body.metadata.category,
    type: annotation.body.type,
    lineIndex: positionRelativeToView.start.line,
    startChar,
    endChar,
  };
}
