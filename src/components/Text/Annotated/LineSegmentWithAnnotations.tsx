import { isNestedAnnotationSegment, Segment } from "./AnnotationModel.ts";
import {
  NestedAnnotation,
  NestedAnnotationProps,
} from "./NestedAnnotation.tsx";

export type OnClickSegment = (value: Segment | undefined) => void;
export type LineSegmentWithAnnotationsProps = Omit<
  NestedAnnotationProps,
  "toNest"
> & {
  onClickSegment?: OnClickSegment;
};

export function LineSegmentWithAnnotations(
  props: LineSegmentWithAnnotationsProps,
) {
  const nestedAnnotations = props.segment.annotations.filter(
    isNestedAnnotationSegment,
  );

  return (
    <span
      className="annotated-segment"
      onClick={() =>
        props.onClickSegment && props.onClickSegment(props.segment)
      }
    >
      <NestedAnnotation {...props} toNest={nestedAnnotations} />
    </span>
  );
}
