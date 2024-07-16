import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import {
  AnnotationGroup,
  GroupedSegments,
  isNestedAnnotationSegment,
  LineOffsets,
  Segment,
} from "./AnnotationModel.ts";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import { useEffect, useState } from "react";
import { AnnotatedSegmentModal } from "../AnnotatedSegmentModal.tsx";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { OnClickSegment } from "./LineSegmentWithAnnotations.tsx";

/**
 * Definitions:
 * - Logical text: 'doorlopende' text, not split by line breaks
 * - Line: piece of annotated text as received from broccoli, a 'line' could also contain a logical text
 * - Annotation offset: character index at which an annotation starts or stops
 * - Character index: start index marks first character to include, stop index marks first character to exclude
 * - Line segment: piece of line uninterrupted by annotation offsets
 * - Annotation segment: piece of an annotation uninterrupted by the offsets of other overlapping/nested annotations
 * - Annotation group: all annotations that are connected to each other by other overlapping/nested annotations
 * - Annotation depth: the number of levels that an annotation is nested in parent annotations or with overlapping annotations
 *   (when two annotations overlap, the second annotation has a depth of 2)
 */
export function SegmentedLine(props: { line: string; offsets: LineOffsets[] }) {
  const { line, offsets } = props;
  const [segments, setSegments] = useState<Segment[]>([]);

  if (line.startsWith("Synde ter vergaderinge")) {
    console.time("create-line");
  }
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

  if (line.startsWith("Synde ter vergaderinge")) {
    console.timeLog("create-line", { line, segments });
    console.timeEnd("create-line");
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

export function SegmentGroup(props: {
  group: GroupedSegments;
  clickedGroup?: GroupedSegments;
  clickedSegment?: Segment | undefined;
  onClickSegment?: OnClickSegment;
}) {
  const { group, clickedGroup, clickedSegment } = props;

  if (!clickedGroup) {
    return (
      <LineSegmentsViewer
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
      />
    );
  }
  return (
    <AnnotatedSegmentModal clickedGroup={clickedGroup}>
      <LineSegmentsViewer
        groupId={group.id}
        segments={group.segments}
        showDetails={false}
        clickedSegment={clickedSegment}
        onClickSegment={props.onClickSegment}
      />
    </AnnotatedSegmentModal>
  );
}

function getAnnotationGroup(segment?: Segment): AnnotationGroup | undefined {
  if (!segment) {
    return;
  }
  return segment.annotations.find(isNestedAnnotationSegment)?.group;
}
