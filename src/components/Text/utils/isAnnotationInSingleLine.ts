import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation.ts";
import { BroccoliViewPosition } from "../BroccoliViewPosition.ts";

export function isAnnotationInSingleLine(
  annotation: AnnoRepoAnnotation,
  relativePositions: BroccoliViewPosition[],
) {
  const relative = relativePositions.find(
    (p) => p.bodyId === annotation.body.id,
  );
  const isInSingleLine = relative && relative.start.line === relative.end.line;
  if (!isInSingleLine) {
    console.debug(`Ignoring multiline annotation ${annotation.id}`);
  }
  return isInSingleLine;
}
