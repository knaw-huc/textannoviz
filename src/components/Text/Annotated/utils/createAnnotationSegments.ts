import _ from "lodash";
import {
  AnnotationGroup,
  AnnotationOffset,
  OffsetsByCharIndex,
  SegmentedAnnotation,
  SegmentedLine,
} from "../Model.ts";

export function createAnnotationSegments(
  line: string,
  offsetsByCharIndex: OffsetsByCharIndex[],
): SegmentedLine[] {
  const annotationSegments: SegmentedLine[] = [];

  // To sort annotations by length:
  const endOffsets: AnnotationOffset[] = offsetsByCharIndex
    .flatMap((charIndex) => charIndex.offsets)
    .filter((offset) => offset.type === "end");

  const firstCharIndex = offsetsByCharIndex[0]?.charIndex;
  const lineStartsWithAnnotation = firstCharIndex === 0;
  if (!lineStartsWithAnnotation) {
    annotationSegments.push({
      body: line.slice(0, firstCharIndex),
      annotations: [],
    });
  }

  const currentAnnotations: SegmentedAnnotation[] = [];
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
          }) as SegmentedAnnotation,
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
    const end1 = endOffsets.find((o) => o.annotationId === start1.annotationId);
    const end2 = endOffsets.find((o) => o.annotationId === start2.annotationId);
    if (!end1 || !end2) {
      throw new Error(
        "Could not find annotations while sorting: " +
          `${start1.annotationId}=${end1}, ${start2.annotationId}=${end2}`,
      );
    }
    const size1 = end1.charIndex - start1.charIndex;
    const size2 = end2.charIndex - start2.charIndex;
    if (size1 < size2) {
      return 1;
    } else if (size1 > size2) {
      return -1;
    } else {
      return 0;
    }
  }
}
