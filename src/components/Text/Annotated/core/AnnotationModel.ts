/**
 * Annotation types:
 * - highlight: highlighted but unclickable
 * - annotation: entity annotations
 * - marker: marking places of zero length
 */
export type AnnotationType = "highlight" | "nested" | "marker" | "block";
export type AnnotationId = string;
export type Body = { id: AnnotationId };

export type WithTypeAndBody<T extends Body = Body> = {
  type: AnnotationType;
  blockType?: BlockType;
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

type Highlight = { type: "highlight" };
type Marker = { type: "marker" };
type Nested = {
  type: "nested";
  depth: number;
  group: AnnotationGroup;
};
type Block = {
  type: "block";
  blockType: BlockType;
};

/**
 * Annotation with its start and end offsets
 * using body.id and offsets (startSegment, endSegment)
 */
export type AnnotationSegment =
  | NestedSegment
  | HighlightSegment
  | MarkerSegment
  | BlockAnnotationSegment;

/**
 * Marker and highlight 'annotations' aren't part of nested annotations
 * but are nested inside the other nested annotations
 */
export type HighlightSegment<HIGHLIGHT extends Body = Body> = Highlight &
  AnnotationSegmentWithBodyAndOffsets<HIGHLIGHT>;
export type MarkerSegment<MARKER extends Body = Body> = Marker &
  AnnotationSegmentWithBodyAndOffsets<MARKER>;
export type NestedSegment<ANNOTATION extends Body = Body> = Nested &
  AnnotationSegmentWithBodyAndOffsets<ANNOTATION>;
export type BlockAnnotationSegment<T extends Body = Body> =
  AnnotationSegmentWithBodyAndOffsets<T> & Block;

export function isNestedSegment(
  toTest: AnnotationSegment,
): toTest is NestedSegment {
  return toTest.type === "nested";
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
export function isBlockAnnotationSegment(
  toTest: AnnotationSegment,
): toTest is BlockAnnotationSegment {
  return toTest.type === "block";
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

export type BlockType = string;
export type GetBlockType<T extends Body = Body> = (body: T) => BlockType;
