import { TextSegment } from "./TextSegment.tsx";
import { Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./TextSegmentWithAnnotations.tsx";
import _ from "lodash";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export type TextSegmentsViewerProps = {
  segments: Segment[];
  showDetails: boolean;
  clickedSegment?: Segment;
  onClickSegment?: OnClickSegment;
  groupId?: number;
};

export function TextSegmentsViewer(props: TextSegmentsViewerProps) {
  const projectConfig = useProjectStore(projectConfigSelector);

  const classes = ["text-segment"];
  const isPartOfAnnotationGroup = _.isNumber(props.groupId);
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
        <TextSegment
          key={i}
          segment={segment}
          clickedSegment={props.clickedSegment}
          onClickSegment={props.onClickSegment}
        />
      ))}
    </span>
  );
}
