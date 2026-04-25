import { TextSegmentsViewer } from "./TextSegmentsViewer.tsx";
import { useAnnotatedTextConfig } from "../useAnnotatedTextConfig.tsx";
import { GroupedSegments } from "../AnnotationModel.ts";
import { GroupProvider } from "./GroupContext.tsx";

export function SegmentGroup(props: { group: GroupedSegments }) {
  const { Group } = useAnnotatedTextConfig();
  const { group } = props;

  return (
    <GroupProvider value={group}>
      <Group group={group}>
        <TextSegmentsViewer segments={group.segments} />
      </Group>
    </GroupProvider>
  );
}
