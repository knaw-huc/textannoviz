import { OffsetsByCharIndex } from "./listAnnotationOffsets.ts";
import _ from "lodash";
import {
  AnnotationSegment,
  LineSegment,
  AnnotationGroup,
} from "../LineSegment.ts";

export function createAnnotationSegments(
  line: string,
  offsetsByCharIndex: OffsetsByCharIndex[],
): LineSegment[] {
  const annotationSegments: LineSegment[] = [];

  const firstCharIndex = offsetsByCharIndex[0]?.charIndex;
  const lineStartsWithAnnotation = firstCharIndex === 0;
  if (!lineStartsWithAnnotation) {
    annotationSegments.push({
      body: line.slice(0, firstCharIndex),
      annotations: [],
    });
  }

  const currentAnnotations: AnnotationSegment[] = [];
  let currentAnnotationDepth = 0;

  let annotationGroup: AnnotationGroup = {
    id: 1,
    maxDepth: 0,
  };

  for (let i = 0; i < offsetsByCharIndex.length; i++) {
    const offsetsAtCharIndex = offsetsByCharIndex[i];
    const next: OffsetsByCharIndex | undefined = offsetsByCharIndex[i + 1];
    const currentLineSegment = line.slice(
      offsetsAtCharIndex.charIndex,
      next?.charIndex || line.length,
    );

    if (!currentLineSegment) {
      continue;
    }

    const annotationsClosingAtCharIndex = offsetsAtCharIndex.offsets
      .filter((offset) => offset.type === "end")
      .map((endOffset) => endOffset.annotationId);
    _.remove(currentAnnotations, (a) =>
      annotationsClosingAtCharIndex.includes(a.id),
    );
    currentAnnotationDepth -= annotationsClosingAtCharIndex.length;

    const hasClosedAllAnnotations =
      !currentAnnotations.length && annotationsClosingAtCharIndex.length;
    if (hasClosedAllAnnotations) {
      currentAnnotationDepth = 0;
      annotationGroup = {
        id: annotationGroup.id + 1,
        maxDepth: 0,
      };
    }

    const annotationsOpeningAtCharIndex = offsetsAtCharIndex.offsets
      .filter((offset) => offset.type === "start")
      .map(
        (startOffset) =>
          ({
            id: startOffset.annotationId,
            depth: ++currentAnnotationDepth,
            group: annotationGroup,
          }) as AnnotationSegment,
      );

    currentAnnotations.push(...annotationsOpeningAtCharIndex);
    annotationGroup.maxDepth = _.max([
      annotationGroup.maxDepth,
      currentAnnotationDepth,
    ])!;

    annotationSegments.push({
      body: currentLineSegment,
      annotations: currentAnnotations.length ? [...currentAnnotations] : [],
    });
  }
  return annotationSegments;
}
