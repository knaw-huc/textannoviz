import { GroupedSegments, Segment } from "./AnnotationModel.ts";
import { OnClickSegment } from "./TextSegmentWithAnnotations.tsx";
import { TextSegmentsViewer } from "./TextSegmentsViewer.tsx";
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
      <TextSegmentsViewer
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
      />
    );
  }
  return (
    <EntityModalButton
      clickedGroup={clickedGroup}
      isOpen={!!clickedGroup && clickedGroup.id === group.id}
      onToggleOpen={(isOpen) => {
        if (props.onClickSegment && !isOpen) {
          props.onClickSegment(undefined);
        }
      }}
    >
      <TextSegmentsViewer
        groupId={group.id}
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
        onClickSegment={props.onClickSegment}
      />
    </EntityModalButton>
  );
}
