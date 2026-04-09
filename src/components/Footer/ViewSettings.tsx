import React from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { HelpTooltip } from "../common/HelpTooltip";

export const ViewSettings = () => {
  const translateProject = useProjectStore(translateProjectSelector);
  const { activePanels, setActivePanels } = useDetailViewStore();
  const [isMobileDialogOpen, setIsMobileDialogOpen] = React.useState(false);
  const firstToggleRef = React.useRef<HTMLButtonElement | null>(null);
  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);

  function handlePanelVisibility(
    panelName: string,
    options?: { singleActive?: boolean },
  ) {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const singleActive = options?.singleActive ?? isMobile;

    const newActivePanels = activePanels.map((activePanel) => {
      if (singleActive) {
        if (activePanel.name === panelName) {
          activePanel.visible = true;
          return activePanel;
        }
        activePanel.visible = false;
        return activePanel;
      }

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

  React.useEffect(() => {
    if (!isMobileDialogOpen) return;
    firstToggleRef.current?.focus();
  }, [isMobileDialogOpen]);

  return (
    <div className="relative">
      <div className="flex *:border-y *:border-stone-500 *:bg-white *:px-2 *:py-2 *:text-sm *:md:p-2">
        <div className="hidden rounded-l-full border-x italic text-neutral-500 md:block">
          Content view
          <HelpTooltip label={translateProject("VIEW_HELP")} />
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border-r md:hidden"
          aria-haspopup="dialog"
          aria-expanded={isMobileDialogOpen}
          aria-controls="view-panels-dialog"
          ref={triggerButtonRef}
          onClick={() => setIsMobileDialogOpen(true)}
        >
          {translateProject("CONTENT_VIEWS")} &#9650;
        </button>
        {activePanels.map((detailPanel) => (
          <button
            id={`b-${detailPanel.name}`}
            key={detailPanel.name}
            onClick={() => handlePanelVisibility(detailPanel.name)}
            className="hidden gap-1 border-r last:rounded-r-full disabled:cursor-not-allowed disabled:text-neutral-400 md:flex"
            disabled={detailPanel.disabled}
            aria-pressed={detailPanel.visible}
          >
            {translateProject(detailPanel.name)}
          </button>
        ))}
      </div>
      {isMobileDialogOpen && (
        <div className="min-w-screen absolute bottom-full left-0 mb-3 w-[320px] -translate-x-[200px] md:hidden">
          <div
            id="view-panels-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="view-panels-title"
            className="w-full rounded-md border bg-neutral-50 p-4 shadow-lg "
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 id="view-panels-title" className="text-base font-semibold">
                {translateProject("CONTENT_PANELS")}
              </h2>
              <button
                type="button"
                className="p-2 text-base text-sm text-neutral-600"
                onClick={() => setIsMobileDialogOpen(false)}
              >
                &#10006;
              </button>
            </div>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
              {activePanels.map((detailPanel, index) => (
                <button
                  key={detailPanel.name}
                  ref={index === 0 ? firstToggleRef : undefined}
                  type="button"
                  onClick={() => {
                    handlePanelVisibility(detailPanel.name, {
                      singleActive: true,
                    });
                    setIsMobileDialogOpen(false);
                    triggerButtonRef.current?.focus();
                  }}
                  className="flex items-center justify-between rounded border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:text-neutral-400"
                  disabled={detailPanel.disabled}
                  aria-pressed={detailPanel.visible}
                >
                  <span className={detailPanel.visible ? "font-semibold" : ""}>
                    {translateProject(detailPanel.name)}
                  </span>
                  <span aria-hidden="true">
                    {detailPanel.visible ? "✓" : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
