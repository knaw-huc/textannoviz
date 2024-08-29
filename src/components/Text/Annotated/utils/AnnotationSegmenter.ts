import _ from "lodash";
import { MarkerBody } from "../../../../model/AnnoRepoAnnotation.ts";
import {
  AnnotationGroup,
  AnnotationOffset,
  AnnotationSegment,
  isMarkerAnnotationOffset,
  isNestedAnnotationOffset,
  isNestedAnnotationSegment,
  isSearchHighlightAnnotationOffset,
  MarkerSegment,
  NestedAnnotationSegment,
  OffsetsByCharIndex,
  SearchHighlightBody,
  SearchHighlightSegment,
  Segment,
} from "../AnnotationModel.ts";

/**
 * An {@link AnnotationOffset} (start or end) marks the boundary between two segments,
 * all offsets together result in a line split up into a list of {@link Segment}s.
 * A Segment also contains a list of annotations that apply to that line segment.
 * When a line segment contains no annotations, the segment annotation list will be empty.
 */
export class AnnotationSegmenter {
  /**
   * Needed to determine length of annotations
   * when sorting annotations {@link byAnnotationSize}
   */
  private endOffsets: AnnotationOffset[];

  /**
   * Annotations that include the current character
   */
  private currentAnnotationSegments: AnnotationSegment[] = [];

  /**
   * Depth of nested annotations in an annotation group
   * prefix increment, i.e. first depth is 1
   */
  private currentAnnotationDepth = 0;

  /**
   * Group of annotations connected through overlap or nesting
   * (just touching is not enough)
   */
  private annotationGroup: AnnotationGroup = {
    id: 1,
    maxDepth: 0,
  };

  /**
   * Segments to return
   */
  private segments: Segment[] = [];

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

    for (
      let charIndex = 0;
      charIndex < this.offsetsByCharIndex.length;
      charIndex++
    ) {
      const offsetsAtCharIndex = this.offsetsByCharIndex[charIndex];
      this.handleEndOffsets(offsetsAtCharIndex);
      const currentSegmentBody = this.createSegmentBody(
        charIndex,
        offsetsAtCharIndex,
      );

      this.handleStartOffsets(offsetsAtCharIndex, currentSegmentBody);
    }
    return this.segments;
  }

  private handleAnnotationlessStart() {
    const firstCharIndex = this.offsetsByCharIndex[0]?.charIndex;
    const lineStartsWithAnnotation = firstCharIndex === 0;
    if (!lineStartsWithAnnotation) {
      this.segments.push({
        index: 0,
        body: this.line.slice(0, firstCharIndex),
        annotations: [],
      });
    }
  }

  /**
   * From current offset to next offset, or to end of line
   */
  private createSegmentBody(
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

  private handleStartOffsets(
    offsetsAtCharIndex: OffsetsByCharIndex,
    lineFromCurrentToNextOffset: string,
  ) {
    const startOffsets = offsetsAtCharIndex.offsets
      .filter((offset) => offset.mark === "start")
      .sort(this.byAnnotationSize.bind(this));

    this.currentAnnotationSegments.push(
      ...this.createAnnotationSegments(startOffsets),
    );
    this.annotationGroup.maxDepth = _.max([
      this.annotationGroup.maxDepth,
      this.currentAnnotationDepth,
    ])!;

    this.segments.push(...this.createEmptyMarkerSegments(startOffsets));
    this.segments.push(this.createSegmentFromLine(lineFromCurrentToNextOffset));
  }

  private createSegmentFromLine(lineFromCurrentToNextOffset: string) {
    return {
      index: this.segments.length,
      body: lineFromCurrentToNextOffset,
      annotations: [...this.currentAnnotationSegments],
    };
  }

  private createEmptyMarkerSegments(
    startOffsets: AnnotationOffset[],
  ): Segment[] {
    return startOffsets.filter(isMarkerAnnotationOffset).map((markerOffset) => {
      return {
        index: this.segments.length,
        body: "",
        annotations: [
          this.createMarkerSegment(markerOffset),
          ...this.currentAnnotationSegments,
        ],
      };
    });
  }

  private createAnnotationSegments(
    startOffsets: AnnotationOffset[],
  ): (AnnotationSegment | SearchHighlightSegment)[] {
    return (
      startOffsets
        // Markers are handled seperately:
        .filter((o) => o.type !== "marker")
        .map((offset) => {
          if (isNestedAnnotationOffset(offset)) {
            return this.createNestedAnnotationSegment(offset);
          } else if (isSearchHighlightAnnotationOffset(offset)) {
            return this.createSearchAnnotationSegment(offset);
          } else {
            throw new Error(
              "Could could determine offset type of " + JSON.stringify(offset),
            );
          }
        })
    );
  }

  private handleEndOffsets(offsetsAtCharIndex: OffsetsByCharIndex) {
    const annotationIdsClosingAtCharIndex = offsetsAtCharIndex.offsets
      .filter((offset) => offset.mark === "end")
      // Marker start sets end, ignore end offset:
      .filter((offset) => offset.type !== "marker")
      .map((endOffset) => endOffset.body.id);
    const closingAnnotations = this.currentAnnotationSegments.filter((a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
    closingAnnotations.forEach((a) => {
      a.endSegment = this.segments.length;
    });
    _.remove(this.currentAnnotationSegments, (a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
    const currentNested = this.currentAnnotationSegments.filter(
      isNestedAnnotationSegment,
    );
    this.currentAnnotationDepth = _.maxBy(currentNested, "depth")?.depth || 0;

    // Create new annotation group when all annotations are closed:
    const hasClosedAllAnnotations =
      !this.currentAnnotationSegments.length &&
      annotationIdsClosingAtCharIndex.length;
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
        "Could not find end offset while sorting: " +
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
  ): SearchHighlightSegment {
    return {
      ...this.createSegmentOffsets(),
      type: "search",
      body: startOffset.body,
    };
  }

  private createMarkerSegment(
    startOffset: AnnotationOffset<MarkerBody>,
  ): MarkerSegment {
    return {
      startSegment: this.segments.length,
      endSegment: this.segments.length, // Set endSegment at end offset
      type: "marker",
      body: startOffset.body,
    };
  }

  private createSegmentOffsets() {
    return {
      startSegment: this.segments.length,
      endSegment: -1, // Set endSegment at end offset
    };
  }
}
