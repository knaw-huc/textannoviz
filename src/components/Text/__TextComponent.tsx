import React from "react";
import styled from "styled-components";
import { useAnnotationStore } from "../../stores/annotation";
import { useTextStore } from "../../stores/text";
import { TextHighlighting } from "./TextHighlighting";

const TextStyled = styled.div`
  width: 450px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  border-left: 1px solid black;
  border-right: 1px solid black;
  font-size: 1rem;
  line-height: 1.8rem;
`;

export function TextComponent() {
  const text = useTextStore((state) => state.text);
  const openAnn = useAnnotationStore((state) => state.openAnn);

  const [highlightedLines, setHighlightedLines] = React.useState<number[]>([]);

  React.useEffect(() => {
    if (openAnn) {
      const indices = openAnn.flatMap((ann) => {
        return ann.indicesToHighlight;
      });

      setHighlightedLines(indices);
    }
  }, [openAnn]);

  return (
    <TextStyled>
      {text.lines && (
        <TextHighlighting text={text} highlightedLines={highlightedLines} />
      )}
    </TextStyled>
  );
}
