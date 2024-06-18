import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createAnnotationOffsets } from "./utils/createAnnotationOffsets.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { useState } from "react";
import {
  AnnotationBodyId,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { useParams } from "react-router-dom";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createSearchOffsets } from "./utils/createSearchOffsets.ts";
import { useSearchStore } from "../../../stores/search/search-store.ts";
import { DUMMY_ANNOTATION_RESOLUTION } from "../../../utils/broccoli.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const AnnotatedText = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore().annotations;
  const params = useParams();

  // TODO: clean up dummy search terms
  const useDummy = params.tier2 === DUMMY_ANNOTATION_RESOLUTION;
  console.log("AnnotatedText", { useDummy });
  const searchTermsFromStore = useSearchStore((state) => state.textToHighlight);
  const dummySearchTerms = {
    map: new Map([
      [DUMMY_ANNOTATION_RESOLUTION, ["Huijgens", "Bronchoven", "rdam"]],
    ]),
    exact: false,
  };
  const searchTerms = useDummy ? dummySearchTerms : searchTermsFromStore;

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
    .map((a) => createAnnotationOffsets(a, positions, lines));
  const searchRegex = createSearchRegex(searchTerms, params.tier2);
  const searchOffsets = createSearchOffsets(lines, searchRegex);
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
