import { LineSegment } from "./LineSegment.tsx";
import { Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./LineSegmentWithAnnotations.tsx";
import _ from "lodash";

export type LineSegmentsViewerProps = {
  segments: Segment[];
  showDetails: boolean;
  clickedSegment?: Segment;
  onClickSegment?: OnClickSegment;
  groupId?: number;
};

export function LineSegmentsViewer(props: LineSegmentsViewerProps) {
  const classes = [];
  classes.push(
    props.showDetails ? "fullNestedAnnotation" : "closedNestedAnnotation",
  );
  if (_.isNumber(props.groupId)) {
    classes.push(`group group-${props.groupId}`);
  }
  return (
    <span className={classes.join(" ")}>
      {props.segments.map((segment, i) => (
        <LineSegment
          key={i}
          segment={segment}
          clickedSegment={props.clickedSegment}
          onClickSegment={props.onClickSegment}
        />
      ))}
    </span>
  );
}
