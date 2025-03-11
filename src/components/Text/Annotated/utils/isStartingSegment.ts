import { AnnotationSegment, Segment } from "../AnnotationModel.ts";

export function isStartingSegment(
  segment: Segment,
  annotationSegment: AnnotationSegment,
) {
  return segment.index === annotationSegment.startSegment;
}
