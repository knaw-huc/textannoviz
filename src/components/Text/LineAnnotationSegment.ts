import { AnnotationId } from "./RelativeTextAnnotation.ts";

export type AnnotationSegment = { id: AnnotationId; depth: number };

export type LineAnnotationSegment = {
  annotations?: AnnotationSegment[];
  body: string;
};
