import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { getAnnotationsByType } from "./utils/getAnnotationsByType.ts";
import {
  AnnotationBodyId,
  RelativeTextAnnotation,
} from "./RelativeTextAnnotation.ts";
import { LogicalLineHighlighting } from "./LogicalLineHighlighting.tsx";
import { withRelativePosition } from "./utils/withRelativePosition.ts";
import { isAnnotationInSingleLine } from "./utils/isAnnotationInSingleLine.ts";
import { useState } from "react";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const LogicalTextHighlighting = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore().annotations;
  const typesToHighlight = useAnnotationStore().annotationTypesToHighlight;
  const annotationsToHighlight = getAnnotationsByType(
    annotations,
    typesToHighlight,
  );
  const [annotationUnderMouse, setAnnotationUnderMouse] =
    useState<AnnotationBodyId>();

  const relativePositions = props.text.locations.annotations;
  const lines = props.text.lines;

  let logicalAnnotations: RelativeTextAnnotation[];
  try {
    logicalAnnotations = annotationsToHighlight
      .filter((a) => isAnnotationInSingleLine(a, relativePositions))
      .map((a) => withRelativePosition(a, relativePositions, lines));
  } catch (e) {
    console.error("Could not create logical annotations", e);
    return null;
  }

  console.log("LogicalTextHighlighting", {
    typesToHighlight,
    annotationsToHighlight,
    relativeAnnotationPositions: relativePositions,
    logicalAnnotations,
  });

  return (
    <div className="leading-loose">
      {props.text.lines.map((line, index) => (
        <div key={index} className="w-fit">
          <LogicalLineHighlighting
            line={line}
            annotations={logicalAnnotations.filter(
              (a) => a.lineIndex === index,
            )}
            hoveringOn={annotationUnderMouse}
            onHoverChange={setAnnotationUnderMouse}
          />
        </div>
      ))}
    </div>
  );
};
