import { LineSegment } from "./LineSegment.tsx";
import { Segment } from "./AnnotationModel.ts";

export type LineSegmentsViewerProps = {
  segments: Segment[];
  showDetails: boolean;
  clickedSegment?: Segment;
  onClickSegment: (value: Segment | undefined) => void;
};

export function LineSegmentsViewer(props: LineSegmentsViewerProps) {
  const classes = ["w-fit"];
  classes.push(
    props.showDetails ? "fullNestedAnnotation" : "closedNestedAnnotation",
  );
  return (
    <div className={classes.join(" ")}>
      {props.segments.map((segment, i) => (
        <LineSegment
          key={i}
          segment={segment}
          clickedSegment={props.clickedSegment}
          onClickSegment={props.onClickSegment}
        />
      ))}
    </div>
  );
}
