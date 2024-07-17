import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import {
  AnnotationGroup,
  isNestedAnnotationSegment,
  LineOffsets,
  Segment,
} from "./AnnotationModel.ts";
import { useEffect, useState } from "react";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";

export function SegmentedLine(props: { line: string; offsets: LineOffsets[] }) {
  const { line, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);
  const [clickedSegment, setClickedSegment] = useState<Segment>();
  const clickedAnnotationGroup: AnnotationGroup | undefined =
    getAnnotationGroup(clickedSegment);

  useEffect(() => {
    setSegments(new AnnotationSegmenter(line, offsetsByChar).segment());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickSegment(clicked: Segment | undefined) {
    if (!clicked) {
      setClickedSegment(undefined);
      return;
    }
    setClickedSegment(clicked);
  }

  const grouped = groupSegmentsByGroupId(segments);
  const clickedGroup = grouped.find((g) => g.id === clickedAnnotationGroup?.id);
  return (
    <>
      {grouped.map((group, i) => (
        <SegmentGroup
          key={i}
          group={group}
          clickedGroup={clickedGroup}
          clickedSegment={clickedSegment}
          onClickSegment={handleClickSegment}
        />
      ))}
    </>
  );
}

function getAnnotationGroup(segment?: Segment): AnnotationGroup | undefined {
  if (!segment) {
    return;
  }
  return segment.annotations.find(isNestedAnnotationSegment)?.group;
}
