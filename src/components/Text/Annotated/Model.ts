import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation.ts";

export type AnnotationType = string;
export type AnnotationBodyId = string;

/**
 * Annotation with char positions relative to line
 *
 * Note: end offset excludes last character, as found in the body ID,
 * but not in line with the char index as returned by broccoli (which includes the last char)
 */
export type RelativeTextAnnotation = {
  type: AnnotationType;
  lineIndex: number;

  startChar: number;

  /**
   * Excluding last character (see note {@link RelativeTextAnnotation})
   */
  endChar: number;

  anno: AnnoRepoAnnotation;
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
