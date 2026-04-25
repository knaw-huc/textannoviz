import { TextSegmentWithAnnotations } from "./TextSegmentWithAnnotations.tsx";
import { SegmentBody } from "./SegmentBody.tsx";
import { Segment } from "../AnnotationModel.ts";

export function TextSegment(props: { segment: Segment }) {
  const hasAnnotations = props.segment.annotations[0];
  if (!hasAnnotations) {
    return <SegmentBody body={props.segment.body} />;
  }
  return <TextSegmentWithAnnotations segment={props.segment} />;
}
