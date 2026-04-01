import { GroupedSegments, Segment } from "./AnnotationModel.ts";
import { TextSegmentsViewer } from "./TextSegmentsViewer.tsx";

export function SegmentGroup(props: {
  group: GroupedSegments;
  clickedSegment?: Segment;
  onClickGroup: (group: GroupedSegments, segment: Segment) => void;
}) {
  const { group, clickedSegment } = props;

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
    <TextSegmentsViewer
      groupId={group.id}
      segments={group.segments}
      showDetails={false}
      clickedSegment={clickedSegment}
      onClickSegment={(segment) => {
        if (segment) {
          props.onClickGroup(group, segment);
        }
      }}
    />
  );
}
