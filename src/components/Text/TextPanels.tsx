import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import { TextPanel } from "./TextPanel";

type TextPanelsProps = {
  panels: string[];
  text: any;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanels = (props: TextPanelsProps) => {
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

  function renderPanels() {
    return props.panels.map((panel, key) => {
      return (
        <TextPanel
          key={key}
          text={props.text[`${panel}`] ? props.text[`${panel}`] : props.text}
          panel={panel}
          closePanelHandler={props.closePanelHandler}
          highlightedLines={highlightedLines}
        />
      );
    });
  }

  return <>{renderPanels()}</>;
};
