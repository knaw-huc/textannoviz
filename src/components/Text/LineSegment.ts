import { AnnotationBodyId } from "./RelativeTextAnnotation.ts";

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

export type AnnotationSegment = {
  id: AnnotationBodyId;

  /**
   * Depth of nesting in other annotations
   */
  depth: number;

  group: AnnotationGroup;
};

export type LineSegment = {
  annotations: AnnotationSegment[];
  body: string;
};
