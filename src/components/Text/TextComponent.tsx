import React from "react";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { textContext } from "../../state/text/TextContext";
import { TextHighlighting } from "./TextHighlighting";

const createIndices = (startIndex: number, endIndex: number) => {
  return Array.from(
    { length: endIndex + 1 - startIndex },
    (_, i) => i + startIndex
  );
};

export function TextComponent() {
  const { textState } = React.useContext(textContext);
  const { annotationState } = React.useContext(annotationContext);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (annotationState.annotationItemOpen) {
      console.log(textState.textToHighlight);
      const startIndex = textState.textToHighlight.location.start.line;
      const endIndex = textState.textToHighlight.location.end.line;

      const indices = createIndices(startIndex, endIndex);

      console.log(indices);

      setHighlightedLines(indices);
    } else {
      setHighlightedLines([]);
    }
  }, [annotationState.annotationItemOpen, textState.textToHighlight]);

  return (
    <>
      {textState.text.lines && (
        <TextHighlighting
          text={textState.text.lines}
          highlightedLines={highlightedLines}
        />
      )}
    </>
  );
}
