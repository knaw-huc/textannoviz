import { LineSegment } from "./LineSegment.tsx";
import { Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./LineSegmentWithAnnotations.tsx";
import _ from "lodash";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export type LineSegmentsViewerProps = {
  segments: Segment[];
  showDetails: boolean;
  clickedSegment?: Segment;
  onClickSegment?: OnClickSegment;
  groupId?: number;
};

export function LineSegmentsViewer(props: LineSegmentsViewerProps) {
  const projectConfig = useProjectStore(projectConfigSelector);

  const classes = ["line-segment"];
  const isPartOfAnnotationGroup = _.isNumber(props.groupId);
  if (isPartOfAnnotationGroup) {
    classes.push(
      props.showDetails
        ? "fullNestedAnnotation"
        : `closedNestedAnnotation ${projectConfig.defaultLanguage}`,
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
