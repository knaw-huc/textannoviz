import { TextPanel } from "./TextPanel";

type TextPanelsProps = {
  panels: string[];
  text: any;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanels = (props: TextPanelsProps) => {
  function renderPanels() {
    return props.panels.map((panel, key) => {
      return (
        <TextPanel
          key={key}
          text={props.text[`${panel}`] ? props.text[`${panel}`] : props.text}
          panel={panel}
          closePanelHandler={props.closePanelHandler}
        />
      );
    });
  }

  return <>{renderPanels()}</>;
};
