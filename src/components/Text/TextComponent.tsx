import React from "react";
import { BroccoliText } from "../../model/Broccoli";
import { useSelectedAnn } from "../../state/annotation/AnnotationReducer";
import { TextHighlighting } from "./TextHighlighting";

interface TextComponentProps {
  text: BroccoliText;
}

export function TextComponent(props: TextComponentProps) {
  const selectedAnn = useSelectedAnn((state) => state.selectedAnn);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  React.useEffect(() => {
    const indices = selectedAnn.flatMap((ann) => {
      return ann.indicesToHighlight;
    });
    setHighlightedLines(indices);
  }, [selectedAnn]);

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
