import { Text } from "./TextComponent";
import { TextPanel } from "./TextPanel";

type TextPanelsProps = {
  panels: string[];
  text: Text;
  closePanelHandler: (panelToClose: string) => void;
};

export const TextPanels = (props: TextPanelsProps) => {
  function renderPanels() {
    return props.panels.map((panel, key) => {
      return (
        <TextPanel
          key={key}
          text={props.text.views[`${panel}`]}
          panel={panel}
          closePanelHandler={props.closePanelHandler}
        />
      );
    });
  }

  return <>{renderPanels()}</>;
};
