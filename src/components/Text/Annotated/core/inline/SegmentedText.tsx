import { useEffect, useState } from "react";
import { Segment, TextOffsets } from "../AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { AnnotationSegmenter } from "../utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "../utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "../utils/listOffsetsByChar.ts";

type SegmentedTextProps = {
  body: string;
  offsets: TextOffsets[];
};

export function SegmentedText(props: SegmentedTextProps) {
  const { body, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);

  useEffect(() => {
    const newSegments = new AnnotationSegmenter(body, offsetsByChar).segment();
    setSegments(newSegments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = groupSegmentsByGroupId(segments);

  return (
    <span style={{ display: "block" }}>
      {grouped.map((group, i) => (
        <SegmentGroup key={i} group={group} />
      ))}
    </span>
  );
}
