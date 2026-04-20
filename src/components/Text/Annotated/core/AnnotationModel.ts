/**
 * Annotation types:
 * - highlight: highlighted but unclickable
 * - annotation: entity annotations
 * - marker: marking places of zero length
 */
export type AnnotationType = "highlight" | "annotation" | "marker" | "block";
export type AnnotationId = string;
export type Body = { id: AnnotationId };

export type WithTypeAndBody<T extends Body = Body> = {
  type: AnnotationType;
  body: T;
};

/**
 * Annotation with offsets relative to text
 *
 * Note: end offset excludes last character
 */
export type TextOffsets<T extends Body = Body> = WithTypeAndBody<T> & {
  beginChar: number;
  endChar: number;
};

/**
 * Single (start or end) offset
 */
export type AnnotationOffset<T extends Body = Body> = WithTypeAndBody<T> & {
  charIndex: number;
  mark: "start" | "end";
};

type Annotation = { type: "annotation" };
type Highlight = { type: "highlight" };
type Marker = { type: "marker" };
type Block = { type: "block"; blockType: BlockType };

export type NestedAnnotationOffset = AnnotationOffset & Annotation;

export function isNestedAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is NestedAnnotationOffset {
  return toTest.type === "annotation";
}

export type HighlightAnnotationOffset = AnnotationOffset & Highlight;
export function isHighlightAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is HighlightAnnotationOffset {
  return toTest.type === "highlight";
}

export type BlockAnnotationOffset = AnnotationOffset & Block;
export function isBlockAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is BlockAnnotationOffset {
  return toTest.type === "block";
}

export type MarkerAnnotationOffset = AnnotationOffset & Marker;

export function isMarkerAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is MarkerAnnotationOffset {
  return toTest.type === "marker";
}

export type CharIndex = number;

export type OffsetsByCharIndex = {
  charIndex: CharIndex;
  offsets: AnnotationOffset[];
};

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

export type WithSegmentOffsets = {
  startSegment: number;
  /**
   * Excluding last segment
   */
  endSegment: number;
};

/**
 * Segment of an annotation as found in {@link Segment}
 */
export type AnnotationSegmentWithBodyAndOffsets<T extends Body = Body> =
  WithTypeAndBody<T> & WithSegmentOffsets;

/**
 * Marker and highlight 'annotations' aren't part of nested annotations
 * but are nested inside the other nested annotations
 */
export type HighlightSegment<HIGHLIGHT extends Body = Body> =
  AnnotationSegmentWithBodyAndOffsets<HIGHLIGHT> & Highlight;
export type MarkerSegment<MARKER extends Body = Body> =
  AnnotationSegmentWithBodyAndOffsets<MARKER> & Marker;

/**
 * Segment of a nested annotation as found in {@link Segment}
 */
export type NestedSegment<ANNOTATION extends Body = Body> =
  AnnotationSegmentWithBodyAndOffsets<ANNOTATION> &
    Annotation & {
      /**
       * Depth of nesting in other annotations
       */
      depth: number;
      group: AnnotationGroup;
    };

/**
 * Annotation applied to a text segment
 * using body.id and offsets (startSegment, endSegment)
 */
export type AnnotationSegment =
  | NestedSegment
  | HighlightSegment
  | MarkerSegment
  | BlockSegment;

export function isNestedSegment(
  toTest: AnnotationSegment,
): toTest is NestedSegment {
  return toTest.type === "annotation";
}

export function isHighlightSegment(
  toTest: AnnotationSegment,
): toTest is HighlightSegment {
  return toTest.type === "highlight";
}

export function isMarkerSegment(
  toTest: AnnotationSegment,
): toTest is MarkerSegment {
  return toTest.type === "marker";
}

/**
 * Segment of a text with its text and the annotations that apply
 */
export type Segment = {
  index: number;
  annotations: AnnotationSegment[];
  body: string;
};

export type GroupedSegments = {
  id?: number;
  segments: Segment[];
};

export type BlockSegment<T extends Body = Body> =
  AnnotationSegmentWithBodyAndOffsets<T> & {
    type: "block";
    blockType: BlockType;
  };

export function isBlockAnnotationSegment(
  toTest: AnnotationSegment,
): toTest is BlockSegment {
  return toTest.type === "block";
}

export type BlockType = string;
