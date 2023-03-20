import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import { useTextStore } from "../../stores/text";
import { TextHighlighting } from "./TextHighlighting";

export function TextComponent() {
  const text = useTextStore((state) => state.text);
  const openAnn = useAnnotationStore((state) => state.openAnn);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (openAnn) {
      console.log(openAnn);
      const indices = openAnn.flatMap((ann) => {
        return ann.indicesToHighlight;
      });

      setHighlightedLines(indices);
    }
  }, [openAnn]);

  return (
    <>
      {text.lines && (
        <TextHighlighting text={text} highlightedLines={highlightedLines} />
      )}
    </>
  );
}
