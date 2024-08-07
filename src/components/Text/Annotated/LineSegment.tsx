import {
  LineSegmentWithAnnotations,
  LineSegmentWithAnnotationsProps,
  OnClickSegment,
} from "./LineSegmentWithAnnotations.tsx";
import { SegmentBody } from "./SegmentBody.tsx";

export type LineSegmentProps = Omit<
  LineSegmentWithAnnotationsProps,
  "onClickSegment"
> & {
  onClickSegment?: OnClickSegment;
};

export function LineSegment(props: LineSegmentProps) {
  const hasAnnotations = props.segment.annotations[0];
  if (!hasAnnotations) {
    return <SegmentBody body={props.segment.body} />;
  }
  return <LineSegmentWithAnnotations {...props} />;
}
