import _ from "lodash";
import {
  AnnotationGroup,
  AnnotationOffset,
  AnnotationSegment,
  isNestedAnnotationOffset,
  isSearchHighlightAnnotationOffset,
  NestedAnnotationSegment,
  OffsetsByCharIndex,
  SearchHighlightAnnotationSegment,
  SearchHighlightBody,
  Segment,
} from "../AnnotationModel.ts";

export function createAnnotationSegments(
  line: string,
  offsetsByCharIndex: OffsetsByCharIndex[],
): Segment[] {
  const currentSegments: Segment[] = [];

  // To sort annotations by length:
  const endOffsets: AnnotationOffset[] = offsetsByCharIndex
    .flatMap((charIndex) => charIndex.offsets)
    .filter((offset) => offset.mark === "end");

  // Handle annotation-less first segment:
  const firstCharIndex = offsetsByCharIndex[0]?.charIndex;
  const lineStartsWithAnnotation = firstCharIndex === 0;
  if (!lineStartsWithAnnotation) {
    currentSegments.push({
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
      .filter((offset) => offset.mark === "end")
      .map((endOffset) => endOffset.body.id);
    currentAnnotations
      .filter((a) => annotationIdsClosingAtCharIndex.includes(a.body.id))
      .forEach((a) => (a.endSegment = currentSegments.length));
    _.remove(currentAnnotations, (a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
    currentAnnotationDepth -= annotationIdsClosingAtCharIndex.length;

    // Reset annotation group when all annotations are closed:
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
        .filter((offset) => offset.mark === "start")
        .sort(byAnnotationSize)
        .map((a) => {
          if (isNestedAnnotationOffset(a)) {
            return createNestedAnnotationSegment(a);
          } else if (isSearchHighlightAnnotationOffset(a)) {
            return createSearchAnnotationSegment(a);
          } else {
            throw new Error(
              "Could could determine offset type of " + JSON.stringify(a),
            );
          }
        });

    currentAnnotations.push(...annotationsOpeningAtCharIndex);

    annotationGroup.maxDepth = _.max([
      annotationGroup.maxDepth,
      currentAnnotationDepth,
    ])!;
    currentSegments.push({
      index: currentSegments.length,
      body: currentLineSegment,
      annotations: [...currentAnnotations],
    });
  }
  return currentSegments;

  /**
   * Smallest annotations deepest
   */
  function byAnnotationSize(
    start1: AnnotationOffset,
    start2: AnnotationOffset,
  ) {
    const end1 = endOffsets.find((o) => o.body.id === start1.body.id);
    const end2 = endOffsets.find((o) => o.body.id === start2.body.id);
    if (!end1 || !end2) {
      throw new Error(
        "Could not find annotations while sorting: " +
          `${start1.body.id}=${end1}, ${start2.body.id}=${end2}`,
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

  function createNestedAnnotationSegment(
    startOffset: AnnotationOffset,
  ): NestedAnnotationSegment {
    return {
      ...createSegmentOffsets(),
      depth: ++currentAnnotationDepth,
      group: annotationGroup,
      type: "annotation",
      body: startOffset.body,
    } as NestedAnnotationSegment;
  }

  function createSearchAnnotationSegment(
    startOffset: AnnotationOffset<SearchHighlightBody>,
  ): SearchHighlightAnnotationSegment {
    return {
      ...createSegmentOffsets(),
      type: "search",
      body: startOffset.body,
    };
  }

  function createSegmentOffsets() {
    return {
      startSegment: currentSegments.length,
      endSegment: -1, // Set on closing
    };
  }
}
