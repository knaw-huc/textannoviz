import { Offsets, SegmentOffsets } from "@knaw-huc/text-annotation-segmenter";

/**
 * Annotation types:
 * - highlight: highlighted but unclickable
 * - nested: every annotation nested inside its own clickable, stylable span
 * - marker: marking zero-length places in the text
 * - block: block elements like p, section or div
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
  begin: number;
  end: number;
};

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

/**
 * Annotation linked to its segments
 */
export type AnnotationSegmentWithBodyAndOffsets<T extends Body = Body> =
  WithTypeAndBody<T> & SegmentOffsets;

type Highlight = { type: "highlight" };
type Marker = { type: "marker" };
type Nested = { type: "nested" };
type Block = { type: "block"; blockType: BlockType };

export type HighlightSegment<T extends Body = Body> = Highlight &
  AnnotationSegmentWithBodyAndOffsets<T>;
export type MarkerSegment<T extends Body = Body> = Marker &
  AnnotationSegmentWithBodyAndOffsets<T>;
export type BlockAnnotationSegment<T extends Body = Body> = Block &
  AnnotationSegmentWithBodyAndOffsets<T>;
export type GrouplessNestedSegment<T extends Body = Body> = Nested &
  AnnotationSegmentWithBodyAndOffsets<T>;
export type NestedSegment<T extends Body = Body> = GrouplessNestedSegment<T> & {
  depth: number;
  group: AnnotationGroup;
};

/**
 * Annotation with its start and end offsets
 * using body.id and offsets (beginSegment, endSegment)
 */
export type AnnotationSegment<NESTED_SEGMENT extends object = NestedSegment> =
  | NESTED_SEGMENT
  | HighlightSegment
  | MarkerSegment
  | BlockAnnotationSegment;
export type GrouplessAnnotationSegment =
  AnnotationSegment<GrouplessNestedSegment>;

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
export function isBlockAnnotationSegment<T extends Body = Body>(
  toTest: AnnotationSegment,
): toTest is BlockAnnotationSegment<T> {
  return toTest.type === "block";
}
export function isNestedSegment(
  toTest: AnnotationSegment,
): toTest is NestedSegment {
  return toTest.type === "nested";
}
export function isGrouplessNestedSegment(
  toTest: GrouplessAnnotationSegment,
): toTest is GrouplessNestedSegment {
  return toTest.type === "nested";
}

/**
 * Segment of a text with its text and the annotations that apply
 */
export type Segment<T extends object = AnnotationSegment> = Offsets & {
  index: SegmentIndex;
  annotations: T[];
  body: string;
};
export type SegmentIndex = number;
export type GrouplessSegment = Segment<GrouplessAnnotationSegment>;

export type GroupedSegments = {
  id?: number;
  offsets: Offsets;
  segments: Segment[];
};

export type BlockType = string;
export type GetBlockType<T extends Body = Body> = (body: T) => BlockType;
