import { LineSegment } from "./LineSegment.tsx";
import { AnnotationBodyId, Segment } from "./AnnotationModel.ts";

export type LineSegmentsViewerProps = {
  segments: Segment[];
  showDetails: boolean;
  clickedAnnotation?: AnnotationBodyId;
  onSegmentClicked: (value: Segment | undefined) => void;
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
          clickedAnnotation={props.clickedAnnotation}
          onClickSegment={props.onSegmentClicked}
        />
      ))}
    </div>
  );
}
