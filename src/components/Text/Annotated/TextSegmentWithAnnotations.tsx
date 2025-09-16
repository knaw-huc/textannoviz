import {
  NestedAnnotation,
  NestedAnnotationProps,
} from "./NestedAnnotation.tsx";
import { isNestedAnnotationSegment, Segment } from "./AnnotationModel.ts";

export type OnClickSegment = (value: Segment | undefined) => void;
export type TextSegmentWithAnnotationsProps = Omit<
  NestedAnnotationProps,
  "toNest"
> & {
  onClickSegment?: OnClickSegment;
};

export function TextSegmentWithAnnotations(
  props: TextSegmentWithAnnotationsProps,
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
