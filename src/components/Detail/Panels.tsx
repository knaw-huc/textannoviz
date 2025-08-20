import React from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Panel } from "./Panel";
import { useMiradorStore } from "../../stores/mirador";

export const Panels = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { activePanels, setActivePanels } = useDetailViewStore();
  const iiif = useMiradorStore().iiif;

  React.useEffect(() => {
    const queries = {
      mqSM: window.matchMedia("(min-width: 1px) and (max-width: 768px)"),
      mqMD: window.matchMedia("(min-width: 768px) and (max-width: 1024px)"),
      mqLG: window.matchMedia("(min-width: 1024px) and (max-width: 1280px)"),
      mqXL: window.matchMedia("(min-width: 1280px) and (max-width: 1536px)"),
      mq2XL: window.matchMedia("(min-width: 1536px)"),
    };

    function handleResize() {
      const matchedQuery = Object.entries(queries).find(
        ([, query]) => query.matches,
      )?.[0] as keyof typeof queries;
      if (!matchedQuery) return;

      const newActivePanels = activePanels.map((panel) => {
        const isVisible = (() => {
          if (queries.mqSM.matches) {
            return panel.name === projectConfig.detailPanels[1]?.name;
          }

          if (queries.mqMD.matches) {
            return (
              panel.name === projectConfig.detailPanels[1]?.name ||
              panel.name ===
                projectConfig.detailPanels[
                  projectConfig.detailPanels.length - 1
                ]?.name
            );
          }

          if (queries.mqLG.matches || queries.mqXL.matches) {
            //TODO: clean this up. This is now a hack to disable Mirador when there is no IIIF manifest. This entire logic should be refactored in the future.
            if (!iiif?.manifest) {
              return (
                panel.name === projectConfig.detailPanels[1]?.name ||
                panel.name ===
                  projectConfig.detailPanels[
                    projectConfig.detailPanels.length - 1
                  ]?.name
              );
            } else {
              return (
                panel.name === projectConfig.detailPanels[0]?.name ||
                panel.name === projectConfig.detailPanels[1]?.name ||
                panel.name ===
                  projectConfig.detailPanels[
                    projectConfig.detailPanels.length - 1
                  ]?.name
              );
            }
          }

          if (queries.mq2XL.matches) {
            //TODO: clean this up. This is now a hack to disable Mirador when there is no IIIF manifest. This entire logic should be refactored in the future.
            if (!iiif?.manifest) {
              return (
                panel.name === projectConfig.detailPanels[1]?.name ||
                panel.name === projectConfig.detailPanels[2]?.name ||
                panel.name ===
                  projectConfig.detailPanels[
                    projectConfig.detailPanels.length - 1
                  ]?.name
              );
            } else {
              return true;
            }
          }

          return panel.visible;
        })();
        return {
          ...panel,
          visible: isVisible,
        };
      });

      setActivePanels(newActivePanels);
    }

    handleResize();

    Object.values(queries).forEach((mq) => {
      mq.addEventListener("change", handleResize);
    });

    return () => {
      Object.values(queries).forEach((mq) => {
        mq.removeEventListener("change", handleResize);
      });
    };
  }, []);

  return (
    <>
      {projectConfig.detailPanels.map((panel, index) => {
        return (
          <Panel
            key={index}
            panelToRender={panel.panel}
            panelName={panel.name}
          />
        );
      })}
    </>
  );
};
