import { GroupedSegments, Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./LineSegmentWithAnnotations.tsx";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import { EntityModalButton } from "./EntityModal.tsx";

export function SegmentGroup(props: {
  group: GroupedSegments;
  clickedGroup?: GroupedSegments;
  clickedSegment?: Segment | undefined;
  onClickSegment?: OnClickSegment;
}) {
  const { group, clickedGroup, clickedSegment } = props;

  if (!group?.id) {
    return (
      <LineSegmentsViewer
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
      />
    );
  }
  return (
    <EntityModalButton clickedGroup={clickedGroup}>
      <LineSegmentsViewer
        groupId={group.id}
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
        onClickSegment={props.onClickSegment}
      />
    </EntityModalButton>
  );
}
