import { useEffect, useState } from "react";
import { TextOffsets, Segment, GroupedSegments } from "./AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { EntityModal } from "./EntityModal.tsx";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";

export function SegmentedText(props: { body: string; offsets: TextOffsets[] }) {
  const { body, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);
  const [clickedSegment, setClickedSegment] = useState<Segment>();
  const [openGroup, setOpenGroup] = useState<GroupedSegments | null>(null);

  const offsetsByChar = listOffsetsByChar(offsets);

  useEffect(() => {
    const newSegments = new AnnotationSegmenter(body, offsetsByChar).segment();
    setSegments(newSegments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickGroup(group: GroupedSegments, segment: Segment) {
    setClickedSegment(segment);
    setOpenGroup(group);
  }

  const grouped = groupSegmentsByGroupId(segments);

  return (
    <span className="segmented-text">
      {grouped.map((group, i) => (
        <SegmentGroup
          key={i}
          group={group}
          clickedSegment={clickedSegment}
          onClickGroup={handleClickGroup}
        />
      ))}
      <EntityModal
        clickedGroup={openGroup}
        onClose={() => setOpenGroup(null)}
      />
    </span>
  );
}
