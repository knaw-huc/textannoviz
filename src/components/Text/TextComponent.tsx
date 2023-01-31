import React from "react";
import { fetchBroccoliBodyId } from "../../backend/utils/fetchBroccoli";
import { BroccoliText, BroccoliV3 } from "../../model/Broccoli";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { projectContext } from "../../state/project/ProjectContext";
import { TextHighlighting } from "./TextHighlighting";

interface TextComponentProps {
  text: BroccoliText;
}

const createIndices = (startIndex: number, endIndex: number) => {
  return Array.from(
    { length: endIndex + 1 - startIndex },
    (_, i) => i + startIndex
  );
};

export function TextComponent(props: TextComponentProps) {
  const { annotationState } = React.useContext(annotationContext);
  const { projectState } = React.useContext(projectContext);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  const relativeTo = projectState.config.relativeTo;

  React.useEffect(() => {
    if (annotationState.annotationItemOpen) {
      fetchBroccoliBodyId(
        annotationState.selectedAnnotation.body.id,
        relativeTo
      ).then(function (broccoli: BroccoliV3) {
        if (broccoli !== null) {
          console.log(broccoli);

          const startIndex = broccoli.text.location.start.line;
          const endIndex = broccoli.text.location.end.line;

          const indices = createIndices(startIndex, endIndex);

          setHighlightedLines(indices);
        } else {
          return;
        }
      });
    } else {
      setHighlightedLines([]);
    }
  }, [annotationState.annotationItemOpen]);

  return (
    <>
      {props.text.lines && (
        <TextHighlighting
          text={props.text.lines}
          highlightedLines={highlightedLines}
        />
      )}
    </>
  );
}
