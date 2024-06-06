import { BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { useAnnotationStore } from "../../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import { AnnotatedLine } from "./AnnotatedLine.tsx";
import { withRelativePosition } from "./utils/withRelativePosition.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { useState } from "react";
import { AnnotationBodyId, RelativeTextAnnotation } from "./Model.ts";
import { useParams } from "react-router-dom";
import { createSearchRegex } from "../createSearchRegex.tsx";
import { createSearchAnnotations } from "./utils/createSearchAnnotations.ts";

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

  let relativeAnnotations: RelativeTextAnnotation[];
  try {
    relativeAnnotations = annotationsToHighlight
      .filter((a) => isAnnotationInSingleLine(a, relativePositions))
      .map((a) => withRelativePosition(a, relativePositions, lines));
  } catch (e) {
    console.error("Could not create logical annotations", e);
    return null;
  }
  const searchRegex = createSearchRegex(searchTerms, params.tier2);
  const searchAnnotations = createSearchAnnotations(lines, searchRegex);
  relativeAnnotations.push(...searchAnnotations);
  console.log("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    relativePositions,
    relativeAnnotations,
    searchTerms,
    searchRegex,
    searchAnnotations,
  });

  function handleHoverChange(id: string | undefined) {
    const isSearchHighlight =
      relativeAnnotations.find((a) => a.id === id)?.type === "search";
    if (isSearchHighlight) {
      return;
    }
    return setAnnotationUnderMouse(id);
  }

  return (
    <div className="leading-loose">
      {props.text.lines.map((line, index) => (
        <div key={index} className="w-fit">
          <AnnotatedLine
            line={line}
            annotations={relativeAnnotations.filter(
              (a) => a.lineIndex === index,
            )}
            hoveringOn={annotationUnderMouse}
            onHoverChange={handleHoverChange}
          />
        </div>
      ))}
    </div>
  );
};
