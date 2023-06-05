import { XMarkIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { useProjectStore } from "../../stores/project";

type TextPanelProps = {
  panel: string;
  text: string[];
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

  const textLinesToDisplay: string[][] = [[]];

  props.text.map((token) => {
    if (token.charAt(0) === "\n") {
      textLinesToDisplay.push([]);
    }
    textLinesToDisplay[textLinesToDisplay.length - 1].push(token);
  });

  function renderPanel() {
    return (
      <TextStyled>
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
        {textLinesToDisplay.map((line, key) => (
          <div key={key}>
            {line.map((token) => (
              <span key={key}>{token}</span>
            ))}
          </div>
        ))}
        {/* {props.text} */}
      </TextStyled>
    );
  }

  return renderPanel();
};
