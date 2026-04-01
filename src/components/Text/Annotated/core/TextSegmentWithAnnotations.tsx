import { NestedAnnotation } from "./NestedAnnotation.tsx";
import { isNestedAnnotationSegment, Segment } from "./AnnotationModel.ts";

export function TextSegmentWithAnnotations(props: { segment: Segment }) {
  const nestedAnnotations = props.segment.annotations.filter(
    isNestedAnnotationSegment,
  );

  return (
    <span className="annotated-segment">
      <NestedAnnotation segment={props.segment} toNest={nestedAnnotations} />
    </span>
  );
}
