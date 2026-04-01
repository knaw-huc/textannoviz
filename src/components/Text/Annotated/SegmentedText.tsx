import { useEffect, useState } from "react";
import { Segment, TextOffsets } from "./AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";

export function SegmentedText(props: { body: string; offsets: TextOffsets[] }) {
  const { body, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);
  const [clickedSegment, setClickedSegment] = useState<Segment>();

  useEffect(() => {
    const newSegments = new AnnotationSegmenter(body, offsetsByChar).segment();
    setSegments(newSegments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickSegment(clicked: Segment | undefined) {
    setClickedSegment(clicked);
  }

  const grouped = groupSegmentsByGroupId(segments);

  return (
    <span className="segmented-text">
      {grouped.map((group, i) => (
        <SegmentGroup
          key={i}
          group={group}
          clickedSegment={clickedSegment}
          onClickSegment={handleClickSegment}
        />
      ))}
    </span>
  );
}
