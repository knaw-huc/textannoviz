import _ from "lodash";
import {
  AnnotationGroup,
  AnnotationOffset,
  AnnotationSegment,
  isNestedAnnotationOffset,
  isNestedAnnotationSegment,
  isSearchHighlightAnnotationOffset,
  NestedAnnotationSegment,
  OffsetsByCharIndex,
  SearchHighlightAnnotationSegment,
  SearchHighlightBody,
  Segment,
} from "../AnnotationModel.ts";

export class AnnotationSegmentor {
  private endOffsets: AnnotationOffset[];
  private currentAnnotations: AnnotationSegment[] = [];

  /**
   * prefix increment, i.e. first depth is 1
   */
  private currentAnnotationDepth = 0;
  private annotationGroup: AnnotationGroup = {
    id: 1,
    maxDepth: 0,
  };

  private currentSegments: Segment[] = [];

  constructor(
    private line: string,
    private offsetsByCharIndex: OffsetsByCharIndex[],
  ) {
    this.endOffsets = this.offsetsByCharIndex
      .flatMap((charIndex) => charIndex.offsets)
      .filter((offset) => offset.mark === "end");
  }

  public segment(): Segment[] {
    this.handleAnnotationlessStart();

    for (let i = 0; i < this.offsetsByCharIndex.length; i++) {
      const offsetsAtCharIndex = this.offsetsByCharIndex[i];
      const currentLineBody = this.createLineBody(i, offsetsAtCharIndex);

      if (!currentLineBody) {
        continue;
      }

      this.handleClosingAnnotation(offsetsAtCharIndex);
      this.handleOpeningAnnotations(offsetsAtCharIndex, currentLineBody);
    }

    return this.currentSegments;
  }

  private handleAnnotationlessStart() {
    const firstCharIndex = this.offsetsByCharIndex[0]?.charIndex;
    const lineStartsWithAnnotation = firstCharIndex === 0;
    if (!lineStartsWithAnnotation) {
      this.currentSegments.push({
        index: 0,
        body: this.line.slice(0, firstCharIndex),
        annotations: [],
      });
    }
  }

  private createLineBody(
    i: number,
    offsetsAtCharIndex: OffsetsByCharIndex,
  ): string {
    const nextOffsets: OffsetsByCharIndex | undefined =
      this.offsetsByCharIndex[i + 1];
    return this.line.slice(
      offsetsAtCharIndex.charIndex,
      nextOffsets?.charIndex || this.line.length,
    );
  }

  private handleOpeningAnnotations(
    offsetsAtCharIndex: OffsetsByCharIndex,
    currentLineSegment: string,
  ) {
    const annotationsOpeningAtCharIndex: AnnotationSegment[] =
      offsetsAtCharIndex.offsets
        .filter((offset) => offset.mark === "start")
        .sort(this.byAnnotationSize.bind(this))
        .map((a) => {
          if (isNestedAnnotationOffset(a)) {
            return this.createNestedAnnotationSegment(a);
          } else if (isSearchHighlightAnnotationOffset(a)) {
            return this.createSearchAnnotationSegment(a);
          } else {
            throw new Error(
              "Could could determine offset type of " + JSON.stringify(a),
            );
          }
        });

    this.currentAnnotations.push(...annotationsOpeningAtCharIndex);

    this.annotationGroup.maxDepth = _.max([
      this.annotationGroup.maxDepth,
      this.currentAnnotationDepth,
    ])!;
    this.currentSegments.push({
      index: this.currentSegments.length,
      body: currentLineSegment,
      annotations: [...this.currentAnnotations],
    });
  }

  private handleClosingAnnotation(offsetsAtCharIndex: OffsetsByCharIndex) {
    const annotationIdsClosingAtCharIndex = offsetsAtCharIndex.offsets
      .filter((offset) => offset.mark === "end")
      .map((endOffset) => endOffset.body.id);
    const closingAnnotations = this.currentAnnotations.filter((a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
    closingAnnotations.forEach((a) => {
      a.endSegment = this.currentSegments.length;
    });
    // Only decrement depth when closing annotation is of highest depth:
    closingAnnotations
      .filter(isNestedAnnotationSegment)
      .sort((a1, a2) => (a1.depth > a2.depth ? 1 : -1))
      .forEach((a) => {
        if (a.depth === this.currentAnnotationDepth) {
          this.currentAnnotationDepth--;
        }
      });
    _.remove(this.currentAnnotations, (a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );

    // Reset annotation group when all annotations are closed:
    const hasClosedAllAnnotations =
      !this.currentAnnotations.length && annotationIdsClosingAtCharIndex.length;
    if (hasClosedAllAnnotations) {
      this.currentAnnotationDepth = 0;
      this.annotationGroup = {
        id: this.annotationGroup.id + 1,
        maxDepth: 0,
      };
    }
  }

  /**
   * Nest smallest annotations deepest
   */
  private byAnnotationSize(start1: AnnotationOffset, start2: AnnotationOffset) {
    const end1 = this.endOffsets.find((o) => o.body.id === start1.body.id);
    const end2 = this.endOffsets.find((o) => o.body.id === start2.body.id);
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

  private createNestedAnnotationSegment(
    startOffset: AnnotationOffset,
  ): NestedAnnotationSegment {
    return {
      ...this.createSegmentOffsets(),
      depth: ++this.currentAnnotationDepth,
      group: this.annotationGroup,
      type: "annotation",
      body: startOffset.body,
    } as NestedAnnotationSegment;
  }

  private createSearchAnnotationSegment(
    startOffset: AnnotationOffset<SearchHighlightBody>,
  ): SearchHighlightAnnotationSegment {
    return {
      ...this.createSegmentOffsets(),
      type: "search",
      body: startOffset.body,
    };
  }

  private createSegmentOffsets() {
    return {
      startSegment: this.currentSegments.length,
      endSegment: -1, // Set endSegment on closing
    };
  }
}
