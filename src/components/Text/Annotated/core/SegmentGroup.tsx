import { GroupedSegments } from "./AnnotationModel.ts";
import { TextSegmentsViewer } from "./TextSegmentsViewer.tsx";
import { useAnnotatedTextConfig } from "./useAnnotatedTextConfig.tsx";

export function SegmentGroup(props: { group: GroupedSegments }) {
  const { Group } = useAnnotatedTextConfig();
  const { group } = props;

  return (
    <Group group={group}>
      <TextSegmentsViewer segments={group.segments} />
    </Group>
  );
}
