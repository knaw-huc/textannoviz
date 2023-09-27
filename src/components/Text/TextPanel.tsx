import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { TextHighlighting } from "./TextHighlighting";

type TextPanelProps = {
  panel: string;
  text: BroccoliTextGeneric;
  closePanelHandler: (panelToClose: string) => void;
};

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
      <div
        id={props.panel}
        className="prose border-brand1Grey-100 mx-auto w-full max-w-full overflow-auto border-x border-y p-3 font-serif text-lg"
      >
        <XMarkIcon
          style={{
            height: "1.5rem",
            width: "1.5rem",
            float: "right",
            cursor: "pointer",
          }}
          onClick={() => props.closePanelHandler(props.panel)}
        />
        <strong className="text-brand1Grey-800 mb-4 block border-b-2">
          {(projectConfig &&
            projectConfig.textPanelTitles &&
            projectConfig.textPanelTitles[`${props.panel}`]) ??
            props.panel}
        </strong>
        <TextHighlighting
          text={props.text}
          // highlightedLines={highlightedLines}
        />
      </div>
    );
  }

  return renderPanel();
};
