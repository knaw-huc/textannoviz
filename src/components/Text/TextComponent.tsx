import React from "react";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { TextPanels } from "./TextPanels";
import { ToggleTextPanels } from "./ToggleTextPanels";
import { SkeletonLoader } from "../common/SkeletonLoader.tsx";

type TextComponentProps = {
  panelsToRender: string[];
  allPossiblePanels: string[];
  isLoading: boolean;
};

export const TextComponent = (props: TextComponentProps) => {
  const [panelsToRender, setPanelsToRender] = React.useState(
    props.panelsToRender,
  );
  const textPanels = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);

  function textPanelsCheckboxHandler(event: {
    checked?: boolean;
    value: string;
  }) {
    const checkedTextPanels = [...panelsToRender];

    if (event.checked) {
      checkedTextPanels.push(event.value);
    } else {
      checkedTextPanels.splice(checkedTextPanels.indexOf(event.value), 1);
    }

    setPanelsToRender(checkedTextPanels);
  }

  function closePanelHandler(panelToClose: string) {
    setPanelsToRender(
      panelsToRender?.filter((panel) => panel !== panelToClose),
    );
  }

  return (
    <div className="flex h-full w-6/12 grow flex-col self-stretch">
      <div className="sr-only">
        <h1>Resolutie</h1>
      </div>

      {projectConfig.showToggleTextPanels ? (
        <ToggleTextPanels
          textPanelsCheckboxHandler={textPanelsCheckboxHandler}
          panels={panelsToRender}
        />
      ) : null}
      <div
        className={`${
          projectConfig.showToggleTextPanels
            ? "h-[calc(100vh-150px)]"
            : "h-[calc(100vh-100px)]"
        } flex flex-row overflow-auto`}
      >
        {textPanels && !props.isLoading ? (
          <TextPanels
            panels={panelsToRender}
            text={textPanels}
            closePanelHandler={closePanelHandler}
          />
        ) : (
          <SkeletonLoader />
        )}
      </div>
    </div>
  );
};
