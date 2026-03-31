import { TextSegment } from "./TextSegment.tsx";
import { Segment } from "./AnnotationModel.ts";

export type TextSegmentsViewerProps = {
  segments: Segment[];
  className?: string;
};

export function TextSegmentsViewer(props: TextSegmentsViewerProps) {
  const classes = ["text-segment"];
  if (props.className) {
    classes.push(props.className);
  }

  return (
    <span className={classes.join(" ")}>
      {props.segments.map((segment, i) => (
        <TextSegment key={i} segment={segment} />
      ))}
    </span>
  );
}
