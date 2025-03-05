import { LineSegment } from "./LineSegment.tsx";
import { Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./LineSegmentWithAnnotations.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import isNumber from "lodash/isNumber";

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
  const isPartOfAnnotationGroup = isNumber(props.groupId);
  if (isPartOfAnnotationGroup) {
    classes.push(
      props.showDetails
        ? "fullNestedAnnotation"
        : `closedNestedAnnotation ${projectConfig.selectedLanguage}`,
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
