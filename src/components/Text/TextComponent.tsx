// import { CheckboxChangeEvent } from "primereact/checkbox";
import { Skeleton } from "primereact/skeleton";
import React from "react";
// import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { TextPanels } from "./TextPanels";
// import { ToggleTextPanels } from "./ToggleTextPanels";

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
  // const projectConfig = useProjectStore(projectConfigSelector);

  // function textPanelsCheckboxHandler(event: CheckboxChangeEvent) {
  //   const checkedTextPanels = [...panelsToRender];

  //   if (event.checked) {
  //     checkedTextPanels.push(event.value);
  //   } else {
  //     checkedTextPanels.splice(checkedTextPanels.indexOf(event.value), 1);
  //   }

  //   setPanelsToRender(checkedTextPanels);
  // }

  function closePanelHandler(panelToClose: string) {
    setPanelsToRender(
      panelsToRender?.filter((panel) => panel !== panelToClose),
    );
  }

  return (
    <div className="flex h-auto justify-center overflow-y-hidden p-6">
      {/* <div className="sr-only">
        <h1>Resolutie</h1>
      </div> */}

      {/* {projectConfig.showToggleTextPanels ? (
        <ToggleTextPanels
          textPanelsCheckboxHandler={textPanelsCheckboxHandler}
          panels={panelsToRender}
        />
      ) : null} */}
      <div className="flex w-full flex-col overflow-y-scroll pb-40">
        {textPanels && !props.isLoading ? (
          <TextPanels
            panels={panelsToRender}
            text={textPanels}
            closePanelHandler={closePanelHandler}
          />
        ) : (
          <div className="flex flex-col gap-2 pl-2 pt-2">
            <Skeleton width="16rem" borderRadius="8px" className="h-4" />
            <Skeleton width="24rem" borderRadius="8px" className="h-4" />
            <Skeleton width="12rem" borderRadius="8px" className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
