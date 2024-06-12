import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import { SegmentedLine } from "./SegmentedLine.tsx";
import { createAnnotationOffsets } from "./utils/createAnnotationOffsets.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { useState } from "react";
import { AnnotationBodyId } from "./AnnotationModel.ts";
import { useParams } from "react-router-dom";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createSearchOffsets } from "./utils/createSearchOffsets.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const AnnotatedText = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore().annotations;
  // const searchTerms = useSearchStore((state) => state.textToHighlight);
  const searchTerms = {
    map: new Map([
      [
        "urn:republic:session-3189-num-183-resolution-7",
        ["Huijgens", "Bronchoven", "rdam"],
      ],
    ]),
    exact: false,
  };
  const params = useParams();

  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByType(
    annotations,
    typesToHighlight,
  );
  const [annotationUnderMouse, setAnnotationUnderMouse] =
    useState<AnnotationBodyId>();

  const relativePositions = props.text.locations.annotations;
  const lines = props.text.lines;

  const offsets = annotationsToHighlight
    .filter((a) => isAnnotationInSingleLine(a, relativePositions))
    .map((a) => createAnnotationOffsets(a, relativePositions, lines));
  const searchRegex = createSearchRegex(searchTerms, params.tier2);
  const searchOffsets = createSearchOffsets(lines, searchRegex);
  offsets.push(...searchOffsets);
  console.log("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    relativePositions,
    searchTerms,
    searchRegex,
    searchOffsets,
    offsets,
  });

  function handleHoverChange(id: string | undefined) {
    const isSearchHighlight =
      offsets.find((a) => a.body.id === id)?.type === "search";
    if (isSearchHighlight) {
      return;
    }
    return setAnnotationUnderMouse(id);
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
          />
        </div>
      ))}
    </div>
  );
};
