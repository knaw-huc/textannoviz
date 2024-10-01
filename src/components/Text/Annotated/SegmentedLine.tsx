import { useEffect, useState } from "react";
import {
  AnnotationGroup,
  isNestedAnnotationSegment,
  LineOffsets,
  Segment,
} from "./AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import { EntityModal } from "./EntityModal.tsx";

export function SegmentedLine(props: { line: string; offsets: LineOffsets[] }) {
  const { line, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);
  const [clickedSegment, setClickedSegment] = useState<Segment>();

  useEffect(() => {
    const newSegments = new AnnotationSegmenter(line, offsetsByChar).segment();
    setSegments(newSegments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickSegment(clicked: Segment | undefined) {
    setClickedSegment(clicked);
  }

  const allSegmentGroups = groupSegmentsByGroupId(segments);
  const clickedAnnotationGroup = getAnnotationGroup(clickedSegment);
  const clickedSegmentGroup = allSegmentGroups.find(
    (g) => clickedAnnotationGroup && g.id === clickedAnnotationGroup?.id,
  );

  return (
    <span className="segmented-line">
      {allSegmentGroups.map((group, i) => (
        <SegmentGroup
          key={i}
          group={group}
          clickedGroup={clickedSegmentGroup}
          clickedSegment={clickedSegment}
          onClickSegment={handleClickSegment}
        />
      ))}
      {clickedSegmentGroup && (
        <EntityModal
          isOpen={!!clickedSegmentGroup}
          onClose={() => setClickedSegment(undefined)}
          clickedGroup={clickedSegmentGroup}
        />
      )}
    </span>
  );
}

function getAnnotationGroup(segment?: Segment): AnnotationGroup | undefined {
  if (!segment) {
    return;
  }
  return segment.annotations.find(isNestedAnnotationSegment)?.group;
}
