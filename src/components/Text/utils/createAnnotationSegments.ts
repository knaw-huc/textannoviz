import {
  AnnotationOffset,
  OffsetsByCharIndex,
} from "./listAnnotationOffsets.ts";
import _ from "lodash";
import {
  AnnotationGroup,
  AnnotationSegment,
  LineSegment,
} from "../LineSegment.ts";
import { RelativeTextAnnotation } from "../RelativeTextAnnotation.ts";

export function createAnnotationSegments(
  line: string,
  offsetsByCharIndex: OffsetsByCharIndex[],
  annotations: RelativeTextAnnotation[],
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
      .sort(byAnnotationSize)
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

  /**
   * Smallest annotations first
   */
  function byAnnotationSize(
    start1: AnnotationOffset,
    start2: AnnotationOffset,
  ) {
    const a1 = annotations.find((a) => a.anno.body.id === start1.annotationId);
    const a2 = annotations.find((a) => a.anno.body.id === start2.annotationId);
    if (!a1 || !a2) {
      throw new Error(
        `Could not find annotation of ${JSON.stringify([start1, start2])}`,
      );
    }
    const size1 = a1.endChar - a1.startChar;
    const size2 = a2.endChar - a2.startChar;
    if (size1 < size2) {
      return 1;
    } else if (size1 > size2) {
      return -1;
    } else {
      return 0;
    }
  }
}
