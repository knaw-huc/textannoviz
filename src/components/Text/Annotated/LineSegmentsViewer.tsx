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
  const classes = ["line-segment"];
  const isPartOfAnnotationGroup = _.isNumber(props.groupId);
  if (isPartOfAnnotationGroup) {
    classes.push(
      /**
       * - `fullNestedAnnotation` indicates annotations should be shown in full detail, as rendered in the entity detail modal
       * - `closedNestedAnnotation` indicates only the outer annotation should be highlighted, as rendered in the text viewer
       */
      props.showDetails ? "fullNestedAnnotation" : "closedNestedAnnotation",
    );
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
