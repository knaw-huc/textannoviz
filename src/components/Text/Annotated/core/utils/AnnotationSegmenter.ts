import {
  GrouplessAnnotationSegment,
  BlockAnnotationSegment,
  HighlightSegment,
  MarkerSegment,
  GrouplessNestedSegment,
  GrouplessSegment,
  TextOffsets,
} from "../AnnotationModel.ts";

type Offsets = {
  starting: TextOffsets[];
  ending: TextOffsets[];
};

type OffsetsAtChar = Offsets & {
  charIndex: number;
};

/**
 * A {@link TextOffsets} range marks an annotation with begin and end character offsets.
 * All offsets together result in a text split up into a list of {@link GrouplessSegment}s.
 * A Segment also contains a list of annotations that apply to that text segment.
 * When a text segment contains no annotations, the segment annotation list will be empty.
 */
export class AnnotationSegmenter {
  /**
   * Annotations that include the current character
   */
  private currentAnnotationSegments: GrouplessAnnotationSegment[] = [];

  /**
   * Segments to return
   */
  private segments: GrouplessSegment[] = [];

  constructor(
    private body: string,
    private offsets: TextOffsets[],
  ) {}

  public segment(): GrouplessSegment[] {
    const offsetsByChar = this.groupOffsetsByChar();

    this.handleAnnotationlessStart(offsetsByChar);

    for (let i = 0; i < offsetsByChar.length; i++) {
      const offsetsAtChar = offsetsByChar[i];
      const nextCharIndex = offsetsByChar[i + 1]?.charIndex;
      this.handleEndOffsets(offsetsAtChar);
      this.handleStartOffsets(offsetsAtChar, nextCharIndex);
    }

    this.handleAnnotationlessEnd(offsetsByChar);

    return this.segments;
  }

  private groupOffsetsByChar(): OffsetsAtChar[] {
    const positions = new Map<number, Offsets>();

    const getOrCreate = (charIndex: number) => {
      let entry = positions.get(charIndex);
      if (!entry) {
        entry = { starting: [], ending: [] };
        positions.set(charIndex, entry);
      }
      return entry;
    };

    for (const offset of this.offsets) {
      getOrCreate(offset.beginChar).starting.push(offset);
      getOrCreate(offset.endChar).ending.push(offset);
    }

    return Array.from(positions.entries())
      .sort(([a], [b]) => a - b)
      .map(([charIndex, { starting, ending }]) => ({
        charIndex,
        starting: starting.sort(byAnnotationSize),
        ending,
      }));
  }

  private handleAnnotationlessStart(offsetsByChar: OffsetsAtChar[]) {
    const firstCharIndex = offsetsByChar[0]?.charIndex;
    const textStartsWithAnnotation = firstCharIndex === 0;
    if (!textStartsWithAnnotation) {
      this.segments.push({
        index: this.segments.length,
        body: this.body.slice(0, firstCharIndex),
        annotations: [],
      });
    }
  }

  private handleAnnotationlessEnd(offsetsByChar: OffsetsAtChar[]) {
    const lastOffsets = offsetsByChar.at(-1);

    // No annotations, already sorted by annotationless start:
    if (!lastOffsets) {
      return;
    }

    const lastAnnotatedChar = lastOffsets.charIndex;

    // End offset excludes last char, so no .length-1:
    const lastChar = this.body.length;

    const textEndsWithAnnotation = lastAnnotatedChar === lastChar;
    if (!textEndsWithAnnotation) {
      this.segments.push({
        index: this.segments.length,
        body: this.body.slice(lastAnnotatedChar, lastChar),
        annotations: [],
      });
    }
  }

  private handleStartOffsets(
    offsetsAtChar: OffsetsAtChar,
    nextCharIndex: number | undefined,
  ) {
    this.currentAnnotationSegments.push(
      ...this.createAnnotationSegments(offsetsAtChar.starting),
    );

    this.segments.push(...this.createMarkerSegments(offsetsAtChar.starting));
    this.segments.push(
      ...this.createSegmentWithBody(offsetsAtChar.charIndex, nextCharIndex),
    );
  }

  private createSegmentWithBody(
    charIndex: number,
    nextCharIndex: number | undefined,
  ): GrouplessSegment[] {
    if (nextCharIndex === undefined) {
      return [];
    }
    const segmentBody = this.body.slice(charIndex, nextCharIndex);
    if (!segmentBody) {
      return [];
    }
    return [this.createTextSegment(segmentBody)];
  }

  private createTextSegment(
    textFromCurrentToNextOffset: string,
  ): GrouplessSegment {
    return {
      index: this.segments.length,
      body: textFromCurrentToNextOffset,
      annotations: [...this.currentAnnotationSegments],
    };
  }

  private createMarkerSegments(
    startingOffsets: TextOffsets[],
  ): GrouplessSegment[] {
    return startingOffsets
      .filter((o) => o.type === "marker")
      .map((offset) => {
        return {
          index: this.segments.length,
          body: "",
          annotations: [
            this.createMarkerSegment(offset),
            ...this.currentAnnotationSegments,
          ],
        };
      });
  }

  private createAnnotationSegments(
    startingOffsets: TextOffsets[],
  ): GrouplessAnnotationSegment[] {
    return (
      startingOffsets
        // Markers are handled separately:
        .filter((o) => o.type !== "marker")
        .map((offset) => {
          if (offset.type === "nested") {
            return this.createNestedAnnotationSegment(offset);
          } else if (offset.type === "highlight") {
            return this.createHighlightAnnotationSegment(offset);
          } else if (offset.type === "block") {
            return this.createBlockAnnotationSegment(offset);
          } else {
            throw new Error(
              "Could not determine offset type of " + JSON.stringify(offset),
            );
          }
        })
    );
  }

  private handleEndOffsets(offsetsAtChar: OffsetsAtChar) {
    const annotationIdsClosingAtCharIndex = offsetsAtChar.ending
      // Marker start sets end, ignore end offset:
      .filter((offset) => offset.type !== "marker")
      .map((offset) => offset.body.id);
    const closingAnnotations = this.currentAnnotationSegments.filter((a) =>
      annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
    closingAnnotations.forEach((a) => {
      a.endSegment = this.segments.length;
    });
    this.currentAnnotationSegments = this.currentAnnotationSegments.filter(
      (a) => !annotationIdsClosingAtCharIndex.includes(a.body.id),
    );
  }

  private createNestedAnnotationSegment(
    offset: TextOffsets,
  ): GrouplessNestedSegment {
    return {
      ...this.createSegmentOffsets(),
      type: "nested",
      body: offset.body,
    };
  }

  private createHighlightAnnotationSegment(
    offset: TextOffsets,
  ): HighlightSegment {
    return {
      ...this.createSegmentOffsets(),
      type: "highlight",
      body: offset.body,
    };
  }

  private createMarkerSegment(offset: TextOffsets): MarkerSegment {
    return {
      startSegment: this.segments.length,
      endSegment: this.segments.length,
      type: "marker",
      body: offset.body,
    };
  }

  private createBlockAnnotationSegment(
    offset: TextOffsets,
  ): BlockAnnotationSegment {
    return {
      ...this.createSegmentOffsets(),
      type: "block",
      blockType: offset.blockType!,
      body: offset.body,
    };
  }

  private createSegmentOffsets() {
    return {
      startSegment: this.segments.length,
      endSegment: -1, // Set endSegment at end offset
    };
  }
}

/**
 * Nest smallest annotations deepest
 */
function byAnnotationSize(a: TextOffsets, b: TextOffsets) {
  return b.endChar - b.beginChar - (a.endChar - a.beginChar);
}
