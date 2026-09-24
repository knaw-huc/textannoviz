import React from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { useTranslateProject } from "../../stores/project";
import { HelpTooltip } from "../common/HelpTooltip";

export const ViewSettings = () => {
  const translateProject = useTranslateProject();
  const activePanels = useDetailViewStore((state) => state.activePanels);
  const setActivePanels = useDetailViewStore((state) => state.setActivePanels);
  const setPanelVisibilityPreference = useDetailViewStore(
    (state) => state.setPanelVisibilityPreference,
  );
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
        setPanelVisibilityPreference(panelName, activePanel.visible);
        return activePanel;
      }

      return activePanel;
    });
    setActivePanels(newActivePanels);
  }

  React.useEffect(() => {
    const containerStyle: string[] = [];
    activePanels.forEach((activePanel) => {
      const doc = document.getElementById(activePanel.name);
      // Clear legacy inline button styles (e.g. pink inactive background)
      document.getElementById(`b-${activePanel.name}`)?.removeAttribute("style");

      if (activePanel.visible) {
        doc?.setAttribute("style", "");
        containerStyle.push(activePanel.size);
      } else {
        doc?.setAttribute("style", "display: none");
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

  const contentViewsLabel = translateProject("CONTENT_VIEWS");

  function panelSwitchLabel(panelLabel: string) {
    return `${contentViewsLabel}, ${panelLabel}`;
  }

  return (
    <div className="relative">
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">{contentViewsLabel}</legend>
        <div className="flex *:border-y *:border-stone-500 *:bg-white *:px-2 *:py-2 *:text-xs *:md:p-2">
          <div className="hidden rounded-l-full border-x italic text-neutral-500 md:block">
            <span aria-hidden="true">{contentViewsLabel}</span>
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
            {contentViewsLabel} &#9650;
          </button>
          {activePanels.map((detailPanel) => {
            const label = translateProject(detailPanel.name);
            return (
              <button
                id={`b-${detailPanel.name}`}
                key={detailPanel.name}
                type="button"
                role="switch"
                aria-checked={detailPanel.visible}
                aria-controls={detailPanel.name}
                aria-label={panelSwitchLabel(label)}
                onClick={() => handlePanelVisibility(detailPanel.name)}
                className="hidden items-center gap-1.5 border-r bg-white font-normal last:rounded-r-full aria-checked:font-bold disabled:cursor-not-allowed disabled:text-neutral-400 md:flex"
                disabled={detailPanel.disabled}
              >
                <span
                  aria-hidden="true"
                  className={
                    detailPanel.visible
                      ? "size-2 shrink-0 rounded-full bg-sky-500"
                      : "size-2 shrink-0 rounded-full border border-neutral-500"
                  }
                />
                <span className="inline-grid" aria-hidden="true">
                  <span
                    className="invisible col-start-1 row-start-1 font-bold"
                    aria-hidden="true"
                  >
                    {label}
                  </span>
                  <span className="col-start-1 row-start-1">{label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
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
                aria-label={translateProject("CLOSE")}
                onClick={() => setIsMobileDialogOpen(false)}
              >
                &#10006;
              </button>
            </div>
            <fieldset className="m-0 flex max-h-64 flex-col gap-2 overflow-y-auto border-0 p-0">
              <legend className="sr-only">{contentViewsLabel}</legend>
              {activePanels.map((detailPanel, index) => {
                const label = translateProject(detailPanel.name);
                return (
                  <button
                    key={detailPanel.name}
                    ref={index === 0 ? firstToggleRef : undefined}
                    type="button"
                    role="switch"
                    aria-checked={detailPanel.visible}
                    aria-controls={detailPanel.name}
                    aria-label={panelSwitchLabel(label)}
                    onClick={() => {
                      handlePanelVisibility(detailPanel.name, {
                        singleActive: true,
                      });
                      setIsMobileDialogOpen(false);
                      triggerButtonRef.current?.focus();
                    }}
                    className="flex items-center gap-2 rounded border bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:text-neutral-400"
                    disabled={detailPanel.disabled}
                  >
                    <span
                      aria-hidden="true"
                      className={
                        detailPanel.visible
                          ? "size-2 shrink-0 rounded-full bg-sky-500"
                          : "size-2 shrink-0 rounded-full border border-neutral-500"
                      }
                    />
                    <span
                      aria-hidden="true"
                      className={detailPanel.visible ? "font-semibold" : ""}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </fieldset>
          </div>
        </div>
      )}
    </div>
  );
};
