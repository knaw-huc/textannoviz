import { AnnotationId } from "./RelativeTextAnnotation.ts";

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

export type NestedAnnotation = {
  id: AnnotationId;

  /**
   * Depth of nesting in other annotations
   */
  depth: number;

  group: AnnotationGroup;
};

export type LineAnnotationSegment = {
  annotations?: NestedAnnotation[];
  body: string;
};
