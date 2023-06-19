import React from "react";
import { Broccoli } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { TextPanel } from "./TextPanel";

type TextPanelsProps = {
  panels: string[];
  text: Broccoli["views"];
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
      if (!(panel in props.text)) return;
      return (
        <TextPanel
          key={key}
          text={props.text[`${panel}`]}
          panel={panel}
          closePanelHandler={props.closePanelHandler}
          highlightedLines={highlightedLines}
        />
      );
    });
  }

  return <>{renderPanels()}</>;
};
