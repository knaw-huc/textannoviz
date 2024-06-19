import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createLineOffsets } from "./utils/createLineOffsets.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { useState } from "react";
import {
  AnnotationBodyId,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createLineSearchOffsets } from "./utils/createLineSearchOffsets.ts";
import { DUMMY_ANNOTATION_RESOLUTION } from "../../../utils/broccoli.ts";
import { useDetailUrlParams } from "./utils/useDetailUrlParams.tsx";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const AnnotatedText = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore().annotations;
  const { tier2, highlight } = useDetailUrlParams();
  // TODO: clean up dummy search terms
  const useDummy = tier2 === DUMMY_ANNOTATION_RESOLUTION;
  console.log("AnnotatedText", { useDummy });
  const dummySearchTerms = "Huijgens Bronchoven rdam";
  const searchTerms = useDummy ? dummySearchTerms : highlight;

  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByType(
    annotations,
    typesToHighlight,
  );
  const [annotationUnderMouse, setAnnotationUnderMouse] =
    useState<AnnotationBodyId>();

  const positions = props.text.locations.annotations;
  const lines = props.text.lines;

  const offsets = annotationsToHighlight
    .filter((a) => isAnnotationInSingleLine(a, positions))
    .map((a) => createLineOffsets(a, positions, lines));
  const searchRegex = createSearchRegex(searchTerms, tier2);
  const searchOffsets = createLineSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);
  console.debug("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    positions,
    searchTerms,
    searchRegex,
    searchOffsets,
    offsets,
  });

  function handleHoverChange(segment: Segment | undefined) {
    if (!segment) {
      setAnnotationUnderMouse(undefined);
      return;
    }
    const nestedAnnotations = segment.annotations.filter(
      isNestedAnnotationSegment,
    );
    const deepest = nestedAnnotations.slice(-1)[0];
    setAnnotationUnderMouse(deepest.body.id);
  }

  function handleClick(clicked: Segment | undefined) {
    console.log("handleClick", { clicked });
  }

  return (
    <div className="leading-loose">
      {props.text.lines.map((line, index) => (
        <div key={index} className="w-fit">
          <SegmentedLine
            line={line}
            offsets={offsets.filter((a) => a.lineIndex === index)}
            hoveringOn={annotationUnderMouse}
            onHoverChange={handleHoverChange}
            onClick={handleClick}
          />
        </div>
      ))}
    </div>
  );
};
