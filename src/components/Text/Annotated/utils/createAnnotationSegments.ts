import _ from "lodash";
import {
  AnnotationGroup,
  AnnotationOffset,
  OffsetsByCharIndex,
  AnnotationSegment,
  Segment,
} from "../Model.ts";

export function createAnnotationSegments(
  line: string,
  offsetsByCharIndex: OffsetsByCharIndex[],
): Segment[] {
  const segments: Segment[] = [];

  // To sort annotations by length:
  const endOffsets: AnnotationOffset[] = offsetsByCharIndex
    .flatMap((charIndex) => charIndex.offsets)
    .filter((offset) => offset.type === "end");

  const firstCharIndex = offsetsByCharIndex[0]?.charIndex;
  const lineStartsWithAnnotation = firstCharIndex === 0;
  if (!lineStartsWithAnnotation) {
    segments.push({
      index: 0,
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
    // Handle first line section when without annotations:
    const offsetsAtCharIndex = offsetsByCharIndex[i];
    const next: OffsetsByCharIndex | undefined = offsetsByCharIndex[i + 1];
    const currentLineSegment = line.slice(
      offsetsAtCharIndex.charIndex,
      next?.charIndex || line.length,
    );

    if (!currentLineSegment) {
      continue;
    }

    // Handle annotations closing in current section:
    const annotationIdsClosingAtCharIndex = offsetsAtCharIndex.offsets
      .filter((offset) => offset.type === "end")
      .map((endOffset) => endOffset.annotationId);
    currentAnnotations
      .filter((a) => annotationIdsClosingAtCharIndex.includes(a.id))
      .forEach((a) => (a.endSegment = segments.length));
    _.remove(currentAnnotations, (a) =>
      annotationIdsClosingAtCharIndex.includes(a.id),
    );
    currentAnnotationDepth -= annotationIdsClosingAtCharIndex.length;

    // Handle annotation-less first segment:
    const hasClosedAllAnnotations =
      !currentAnnotations.length && annotationIdsClosingAtCharIndex.length;
    if (hasClosedAllAnnotations) {
      currentAnnotationDepth = 0;
      annotationGroup = {
        id: annotationGroup.id + 1,
        maxDepth: 0,
      };
    }

    // Handle annotations opening in current section:
    const annotationsOpeningAtCharIndex: AnnotationSegment[] =
      offsetsAtCharIndex.offsets
        .filter((offset) => offset.type === "start")
        .sort(byAnnotationSize)
        .map((startOffset) => ({
          id: startOffset.annotationId,
          depth: ++currentAnnotationDepth,
          group: annotationGroup,
          startSegment: segments.length,
          endSegment: -1, // Set on closing
        }));
    currentAnnotations.push(...annotationsOpeningAtCharIndex);
    annotationGroup.maxDepth = _.max([
      annotationGroup.maxDepth,
      currentAnnotationDepth,
    ])!;

    segments.push({
      index: segments.length,
      body: currentLineSegment,
      annotations: currentAnnotations.length ? [...currentAnnotations] : [],
    });
  }
  return segments;

  /**
   * Smallest annotations deepest
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
