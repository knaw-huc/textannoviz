import { Skeleton } from "@nextui-org/react";
import { CheckboxChangeEvent } from "primereact/checkbox";
import React from "react";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { TextPanels } from "./TextPanels";
import { ToggleTextPanels } from "./ToggleTextPanels";

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

  function textPanelsCheckboxHandler(event: CheckboxChangeEvent) {
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
    <div className="relative w-6/12 grow self-stretch">
      {projectConfig.showToggleTextPanels ? (
        <ToggleTextPanels
          textPanelsCheckboxHandler={textPanelsCheckboxHandler}
          panels={panelsToRender}
        />
      ) : null}
      <div className="flex h-[calc(100vh-79px)] flex-row overflow-auto">
        {textPanels && !props.isLoading ? (
          <TextPanels
            panels={panelsToRender}
            text={textPanels}
            closePanelHandler={closePanelHandler}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-64 rounded-lg" />
            <Skeleton className="h-4 w-96 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};
