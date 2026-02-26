import { useEffect, useState } from "react";
import {
  AnnotationGroup,
  isNestedAnnotationSegment,
  TextOffsets,
  Segment,
} from "./AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function SegmentedText(props: { body: string; offsets: TextOffsets[] }) {
  const { body, offsets } = props;
  const projectConfig = useProjectStore(projectConfigSelector);

  const [segments, setSegments] = useState<Segment[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);
  const [clickedSegment, setClickedSegment] = useState<Segment>();

  useEffect(() => {
    const newSegments = new AnnotationSegmenter(body, offsetsByChar).segment();
    setSegments(newSegments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClickSegment(clicked: Segment | undefined) {
    const foundLink = clicked?.annotations.find((a) =>
      projectConfig.isLink(a.body),
    );
    if (foundLink) {
      window.open(projectConfig.getUrl(foundLink.body), "_blank");
      return;
    }
    setClickedSegment(clicked);
  }

  const grouped = groupSegmentsByGroupId(segments);
  const clickedAnnotationGroup = getAnnotationGroup(clickedSegment);
  const clickedGroup = grouped.find((g) => g.id === clickedAnnotationGroup?.id);

  return (
    <span className="segmented-text">
      {grouped.map((group, i) => (
        <SegmentGroup
          key={i}
          group={group}
          clickedGroup={clickedGroup}
          clickedSegment={clickedSegment}
          onClickSegment={handleClickSegment}
        />
      ))}
    </span>
  );
}

function getAnnotationGroup(segment?: Segment): AnnotationGroup | undefined {
  if (!segment) {
    return;
  }
  return segment.annotations.find(isNestedAnnotationSegment)?.group;
}
