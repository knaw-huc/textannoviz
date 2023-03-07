import React from "react";
import { BroccoliTextV3 } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { TextHighlighting } from "./TextHighlighting";

interface TextComponentProps {
  text: BroccoliTextV3;
}

export function TextComponent(props: TextComponentProps) {
  const selectedAnn = useAnnotationStore((state) => state.selectedAnn);

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
