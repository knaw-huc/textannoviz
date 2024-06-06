/**
 * Annotation type
 * - annotation
 * - search highlight
 */
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
export type RelativeTextAnnotation = {
  id: AnnotationBodyId;
  type: AnnotationType;
  category?: AnnotationTypeCategory;
  lineIndex: number;
  startChar: number;

  /**
   * Excluding last character (see note {@link RelativeTextAnnotation})
   */
  endChar: number;
};

export type AnnotationOffset = {
  charIndex: number;
  type: "start" | "end";
  annotationId: AnnotationBodyId;
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
export type AnnotationSegment = {
  id: AnnotationBodyId;

  /**
   * Depth of nesting in other annotations
   */
  depth: number;

  group: AnnotationGroup;
  startSegment: number;

  /**
   * Excluding last segment
   */
  endSegment: number;
};

/**
 * Segment of a line with its text and the annotations that apply
 */
export type Segment = {
  index: number;
  annotations: AnnotationSegment[];
  body: string;
};
