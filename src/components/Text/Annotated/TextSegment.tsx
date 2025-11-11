import {
  TextSegmentWithAnnotations,
  TextSegmentWithAnnotationsProps,
  OnClickSegment,
} from "./TextSegmentWithAnnotations.tsx";
import { SegmentBody } from "./SegmentBody.tsx";

export type TextSegmentProps = Omit<
  TextSegmentWithAnnotationsProps,
  "onClickSegment"
> & {
  onClickSegment?: OnClickSegment;
};

export function TextSegment(props: TextSegmentProps) {
  const hasAnnotations = props.segment.annotations[0];
  if (!hasAnnotations) {
    return <SegmentBody body={props.segment.body} />;
  }
  return <TextSegmentWithAnnotations {...props} />;
}
