import { CheckboxChangeEvent } from "primereact/checkbox";
import { Skeleton } from "primereact/skeleton";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {projectConfigSelector, translateProjectSelector, useProjectStore} from "../../stores/project";
import { useTextStore } from "../../stores/text";
import { TextPanels } from "./TextPanels";
import { ToggleTextPanels } from "./ToggleTextPanels";

type TextComponentProps = {
  panelsToRender: string[];
  allPossiblePanels: string[];
  isLoading: boolean;
};

export type Text = {
  views: Record<string, string[]>;
};

export const TextComponent = (props: TextComponentProps) => {
  const [panelsToRender, setPanelsToRender] = React.useState(
    props.panelsToRender,
  );
  const textPanels = useTextStore((state) => state.views);
  const projectConfig = useProjectStore(projectConfigSelector);
  const params = useParams();
  const translateProject = useProjectStore(translateProjectSelector);

  function textPanelsCheckboxHandler(event: CheckboxChangeEvent) {
    const checkedTextPanels = [...panelsToRender];

    if (event.checked) {
      if (textPanels && !(event.value in textPanels)) {
        toast(
          `Text panel "${translateProject(`${event.value}`).toLowerCase()
          }" is not available for letter "${params.tier1}".`,
          {
            type: "error",
          },
        );
        return;
      }
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
          <div className="skeletonContainerText">
            <Skeleton width="30rem" className="skeleton"></Skeleton>
            <Skeleton width="15rem" className="skeleton"></Skeleton>
            <Skeleton width="7.5rem" className="skeleton"></Skeleton>
          </div>
        )}
      </div>
    </div>
  );
};
