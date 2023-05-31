import React from "react";
import styled from "styled-components";
import { useProjectStore } from "../../stores/project";
import { Text } from "./Text";

type TextPanelProps = {
  panel: string;
  text: Text;
};

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

export const TextPanel = (props: TextPanelProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const [panelEnabled, setPanelEnabled] = React.useState(true);

  function renderPanel() {
    if (panelEnabled) {
      return (
        <TextStyled>
          <button onClick={togglePanelHandler}>Close panel</button>
          <h4>
            {(projectConfig &&
              projectConfig.textPanelTitles &&
              projectConfig.textPanelTitles[`${props.panel}`]) ??
              props.panel}
          </h4>
          {props.text.views[`${props.panel}`]}
        </TextStyled>
      );
    } else {
      return null;
    }
  }

  function togglePanelHandler() {
    setPanelEnabled(!panelEnabled);
  }

  return renderPanel();
};
