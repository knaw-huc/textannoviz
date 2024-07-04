import { listOffsetsByChar } from "./utils/listOffsetsByChar.ts";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import {
  AnnotationGroup,
  isNestedAnnotationSegment,
  LineOffsets,
  Segment,
} from "./AnnotationModel.ts";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import { TextModal } from "../TextModal.tsx";
import { useEffect, useState } from "react";

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
    const s = new AnnotationSegmenter(line, offsetsByChar).segment();
    console.log("SegmentedLine", { s });
    setSegments(s);
  }, []);

  function handleClickSegment(clicked: Segment | undefined) {
    if (!clicked) {
      setClickedSegment(undefined);
      return;
    }
    console.log("handleClick", { clicked });
    setClickedSegment(clicked);
  }

  function isInGroupOfClickedSegment(segment: Segment): boolean {
    // console.log('findAnnotationGroupSegments', segment)
    if (!clickedAnnotationGroup) {
      return false;
    }
    const group = segment.annotations.find(isNestedAnnotationSegment)?.group;
    if (!group) {
      return false;
    }
    return group.id === clickedAnnotationGroup?.id;
  }

  if (line.startsWith("Synde ter vergaderinge")) {
    console.timeLog("create-line", { line, annotationSegments: segments });
    console.timeEnd("create-line");
  }
  const clickedGroup = segments.filter(isInGroupOfClickedSegment);
  console.log("segments", { clickedGroup, segments });
  return (
    <>
      <TextModal segments={clickedGroup} />
      <LineSegmentsViewer
        segments={segments}
        showDetails={false}
        clickedSegment={clickedSegment}
        onClickSegment={handleClickSegment}
      />
    </>
  );
}

function getAnnotationGroup(segment?: Segment): AnnotationGroup | undefined {
  if (!segment) {
    return;
  }
  return segment.annotations.find(isNestedAnnotationSegment)?.group;
}
