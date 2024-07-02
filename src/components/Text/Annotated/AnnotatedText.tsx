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
  const [annotationClicked, setAnnotationClicked] =
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

  function getActiveAnnotationId(segment: Segment) {
    const nestedAnnotations = segment.annotations.filter(
      isNestedAnnotationSegment,
    );
    const deepest = nestedAnnotations.slice(-1)[0];
    return deepest?.body.id;
  }

  function handleSegmentHoverChange(hovered: Segment | undefined) {
    if (!hovered) {
      setAnnotationUnderMouse(undefined);
      return;
    }
    setAnnotationUnderMouse(getActiveAnnotationId(hovered));
  }

  function handleSegmentClicked(clicked: Segment | undefined) {
    if (!clicked) {
      setAnnotationClicked(undefined);
      return;
    }
    console.log("handleClick", { clicked });
    setAnnotationClicked(getActiveAnnotationId(clicked));
  }

  return (
    <div className="">
      {props.text.lines.map((line, index) => (
        <div key={index} className="closedNestedAnnotation w-fit">
          <SegmentedLine
            line={line}
            offsets={offsets.filter((a) => a.lineIndex === index)}
            clickedOn={annotationClicked}
            hoveringOn={annotationUnderMouse}
            onSegmentHoverChange={handleSegmentHoverChange}
            onSegmentClicked={handleSegmentClicked}
          />
        </div>
      ))}
    </div>
  );
};
