import {
  LineSegmentWithAnnotations,
  LineSegmentWithAnnotationsProps,
} from "./LineSegmentWithAnnotations.tsx";
import { SegmentBody } from "./SegmentBody.tsx";

export type LineSegmentProps = LineSegmentWithAnnotationsProps;

export function LineSegment(props: LineSegmentProps) {
  const hasAnnotations = props.segment.annotations[0];
  if (!hasAnnotations) {
    return <SegmentBody body={props.segment.body} depthCorrection={0} />;
  }
  return <LineSegmentWithAnnotations {...props} />;
}
