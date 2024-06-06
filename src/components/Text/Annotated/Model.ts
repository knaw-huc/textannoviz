import { AnnotationBodyId } from "../RelativeTextAnnotation.ts";

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

/**
 * Segment of an annotation as found in {@link SegmentedLine}
 */
export type SegmentedAnnotation = {
  id: AnnotationBodyId;

  /**
   * Depth of nesting in other annotations
   */
  depth: number;

  group: AnnotationGroup;
};

/**
 * Segment of a line with its text and the annotations that apply
 */
export type SegmentedLine = {
  annotations: SegmentedAnnotation[];
  body: string;
};
