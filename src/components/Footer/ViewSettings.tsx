import React from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

export const ViewSettings = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const { activePanels, setActivePanels } = useDetailViewStore();

  function handlePanelVisibility(panelName: string) {
    const newActivePanels = activePanels.map((activePanel) => {
      if (activePanel.name === panelName) {
        activePanel.visible = !activePanel.visible;
        return activePanel;
      }
      return activePanel;
    });
    setActivePanels(newActivePanels);
  }

  React.useEffect(() => {
    const containerStyle: string[] = [];
    activePanels.forEach((activePanel) => {
      const buttonDoc = document.getElementById(`b-${activePanel.name}`);
      const doc = document.getElementById(activePanel.name);

      if (activePanel.visible) {
        doc?.setAttribute("style", "");
        buttonDoc?.setAttribute("style", "");
        containerStyle.push(activePanel.size);
      } else {
        doc?.setAttribute("style", "display: none");
        buttonDoc?.setAttribute("style", "background-color: #F5EDED");
      }
    });

    const panelContainerDoc = document.getElementById("panelsContainer");
    panelContainerDoc?.setAttribute(
      "style",
      `grid-template-columns: ${containerStyle.join(" ")}`,
    );
  }, [activePanels]);

  return (
    <div>
      <div className="flex items-center *:border-y *:border-stone-500 *:bg-white *:px-1 *:py-2 *:text-sm *:md:p-2">
        <div className="rounded-l-full border-x italic text-neutral-500">
          View
        </div>
        {projectConfig.detailPanels.map((detailPanel) => (
          <button
            id={`b-${detailPanel.name}`}
            key={detailPanel.name}
            onClick={() => handlePanelVisibility(detailPanel.name)}
            className="hidden gap-1 border-r md:flex"
          >
            {translateProject(detailPanel.name)}
          </button>
        ))}
        <button className="hidden items-center gap-1 rounded-r-full border-r md:flex">
          Settings
        </button>
      </div>
    </div>
  );
};
