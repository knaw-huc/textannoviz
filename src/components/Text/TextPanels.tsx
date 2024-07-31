import { BroccoliTextGeneric } from "../../model/Broccoli";
import { TextPanel } from "./TextPanel";

type TextPanelsProps = {
  panels: string[];
  text: Record<string, BroccoliTextGeneric>;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanels = (props: TextPanelsProps) => {
  return (
    <>
      {props.panels.map((panel, key) => {
        return (
          <TextPanel
            key={key}
            text={props.text[`${panel}`]}
            panel={panel}
            closePanelHandler={props.closePanelHandler}
          />
        );
      })}
    </>
  );
};
