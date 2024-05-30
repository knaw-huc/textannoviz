import { OffsetsByCharIndex } from "./listAnnotationOffsets.ts";
import _ from "lodash";
import {
  AnnotationSegment,
  LineAnnotationSegment,
} from "../LineAnnotationSegment.ts";

export function createAnnotationSegments(
  annotationOffsets: OffsetsByCharIndex[],
  line: string,
) {
  const annotationSegments: LineAnnotationSegment[] = [];
  const firstCharOffset = annotationOffsets[0].charIndex;
  if (firstCharOffset !== 0) {
    annotationSegments.push({
      body: line.slice(0, firstCharOffset),
    });
  }
  const activeAnnotations: AnnotationSegment[] = [];
  let currentDepth = 0;
  for (let i = 0; i < annotationOffsets.length; i++) {
    const current = annotationOffsets[i];
    const next: OffsetsByCharIndex | undefined = annotationOffsets[i + 1];
    const currentBody = line.slice(
      current.charIndex,
      next?.charIndex || line.length,
    );

    if (!currentBody) {
      continue;
    }

    currentDepth = _.maxBy(activeAnnotations, "depth")?.depth || 0;

    const opening = current.offsets
      .filter((o) => o.type === "start")
      .map((o) => ({
        id: o.annotationId,
        depth: ++currentDepth,
      }));
    activeAnnotations.push(...opening);

    const closing = current.offsets
      .filter((o) => o.type === "end")
      .map((o) => o.annotationId);
    _.remove(activeAnnotations, (aa) => closing.includes(aa.id));

    annotationSegments.push({
      body: currentBody,
      annotations: activeAnnotations.length
        ? [...activeAnnotations]
        : undefined,
    });
  }
  return annotationSegments;
}
