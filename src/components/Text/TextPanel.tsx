import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import styled from "styled-components";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

const TextStyled = styled.div`
  width: 100%;
  height: 850px;
  padding: 0.7em;
  overflow: auto;
  border-left: 1px solid black;
  border-right: 1px solid black;
  border-top: 1px solid black;
  font-size: 1rem;
  line-height: 1.8rem;
`;

export const TextPanel = (props: TextPanelProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);
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

  function renderPanel() {
    return (
      <TextStyled id={props.panel}>
        <XMarkIcon
          style={{
            height: "1.5rem",
            width: "1.5rem",
            float: "right",
            cursor: "pointer",
          }}
          onClick={() => props.closePanelHandler(props.panel)}
        />
        <strong style={{ display: "block", paddingBottom: "0.5em" }}>
          {(projectConfig &&
            projectConfig.textPanelTitles &&
            projectConfig.textPanelTitles[`${props.panel}`]) ??
            props.panel}
        </strong>
        <TextHighlighting
          text={props.text}
          highlightedLines={highlightedLines}
        />
      </TextStyled>
    );
  }

  return renderPanel();
};
