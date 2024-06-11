export type AnnotationType = "search" | "Entity" | string;

/**
 * ID of annotation:
 * - annotation body id
 * - search highlight index
 */
export type AnnotationBodyId = string;

/**
 * Categories of an annotation type
 * e.g. Entity LOC(ations), PER(sons), etc.
 */
export type AnnotationTypeCategory = string;

/**
 * Annotation with char positions relative to line
 *
 * Note: end offset excludes last character, as found in the body ID,
 * but not in line with the char index as returned by broccoli (which includes the last char)
 */
export type RelativeOffsets = {
  id: string;
  type: AnnotationType;
  lineIndex: number;
  startChar: number;

  /**
   * Excluding last character (see note {@link RelativeOffsets})
   */
  endChar: number;
};

export type AnnotationOffsets = RelativeOffsets & {
  id: AnnotationBodyId;
  category?: AnnotationTypeCategory;
};

export type SearchHighlightAnnotationOffsets = RelativeOffsets;

export function isSearchHighlightOffsets(
  toTest: RelativeOffsets,
): toTest is SearchHighlightAnnotationOffsets {
  return toTest.type === "search";
}

/**
 * Single (start or end) offset
 */
export type AnnotationOffset = {
  charIndex: number;
  annotationId: AnnotationBodyId;
  annotationType: AnnotationType;
  mark: "start" | "end";
};

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

/**
 * Segment of an annotation as found in {@link Segment}
 */

export type SegmentOffsets = {
  id: string;
  type: AnnotationType;
  startSegment: number;

  /**
   * Excluding last segment
   */
  endSegment: number;
};

/**
 * Segment of an annotation as found in {@link Segment}
 */
export type AnnotationSegment = SegmentOffsets & {
  id: AnnotationBodyId;

  /**
   * Depth of nesting in other annotations
   */
  depth: number;

  group: AnnotationGroup;
};

export type SearchHighlightAnnotationSegment = SegmentOffsets;

export function isAnnotationSegment(
  toTest: SegmentOffsets,
): toTest is AnnotationSegment {
  return !isSearchHighlightAnnotationSegment(toTest);
}

export function isSearchHighlightAnnotationSegment(
  toTest: SegmentOffsets,
): toTest is SearchHighlightAnnotationSegment {
  return toTest.type === "search";
}

/**
 * Segment of a line with its text and the annotations that apply
 */
export type Segment = {
  index: number;
  annotations: AnnotationSegment[];
  searchHighlight?: SearchHighlightAnnotationSegment;
  body: string;
};
