import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import { useTextStore } from "../../stores/text";
import { TextHighlighting } from "./TextHighlighting";

export function TextComponent() {
  const text = useTextStore((state) => state.text);
  const selectedAnn = useAnnotationStore((state) => state.selectedAnn);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  console.log(text);

  React.useEffect(() => {
    const indices = selectedAnn.flatMap((ann) => {
      return ann.indicesToHighlight;
    });

    setHighlightedLines(indices);
  }, [selectedAnn]);

  return (
    <>
      {text.lines && (
        <TextHighlighting
          text={text.lines}
          highlightedLines={highlightedLines}
        />
      )}
    </>
  );
}
