import React from "react";
import { BroccoliText } from "../../model/Broccoli";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { projectContext } from "../../state/project/ProjectContext";
// import { createIndices } from "../../utils/createIndices";
// import { fetchBroccoliBodyIdRelativeTo } from "../../utils/fetchBroccoli";
import { TextHighlighting } from "./TextHighlighting";

interface TextComponentProps {
  text: BroccoliText;
}

export function TextComponent(props: TextComponentProps) {
  const { annotationState } = React.useContext(annotationContext);
  const { projectState } = React.useContext(projectContext);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  const relativeTo = projectState.config.relativeTo;

  // React.useEffect(() => {
  //   if (annotationState.annotationItemOpen) {
  //     fetchBroccoliBodyIdRelativeTo(
  //       annotationState.selectedAnnotation.body.id,
  //       relativeTo,
  //       projectState.config
  //     ).then(function (broccoli: BroccoliV3) {
  //       if (broccoli !== null) {
  //         console.log(broccoli);

  //         const startIndex = broccoli.text.location.start.line;
  //         const endIndex = broccoli.text.location.end.line;

  //         const indices = createIndices(startIndex, endIndex);

  //         setHighlightedLines(indices);
  //       } else {
  //         return;
  //       }
  //     });
  //   } else {
  //     setHighlightedLines([]);
  //   }
  // }, [annotationState.annotationItemOpen]);

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
