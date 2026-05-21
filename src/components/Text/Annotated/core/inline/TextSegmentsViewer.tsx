import { TextSegment } from "./TextSegment.tsx";
import { Segment } from "../AnnotationModel.ts";

export type TextSegmentsViewerProps = {
  segments: Segment[];
};

export function TextSegmentsViewer(props: TextSegmentsViewerProps) {
  return (
    <>
      {props.segments.map((segment, i) => (
        <TextSegment key={i} segment={segment} />
      ))}
    </>
  );
}
