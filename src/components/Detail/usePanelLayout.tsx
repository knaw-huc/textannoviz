import { useEffect, useMemo } from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useMiradorStore } from "../../stores/mirador";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import { findKey, mapValues } from "lodash";
import uniq from "lodash/uniq";
import { useAnnotationStore } from "../../stores/annotation.ts";

export type PanelPosition = "facsimile" | "second" | "third" | "fourth";
export const layouts = {
  default: {
    s: ["second"],
    m: ["second", "fourth"],
    l: ["second", "fourth"],
    xl: ["second", "fourth"],
    xxl: ["second", "third", "fourth"],
  },
  withFacsimile: {
    s: ["second"],
    m: ["second", "fourth"],
    l: ["facsimile", "second", "fourth"],
    xl: ["facsimile", "second", "fourth"],
    xxl: ["facsimile", "second", "third", "fourth"],
  },
} satisfies Record<string, Layout>;

export const panelToIndex: Record<PanelPosition, number> = {
  facsimile: 0,
  second: 1,
  third: 2,
  fourth: 3,
};

export const layoutBreakpoints: Record<WindowSize, string> = {
  s: "(min-width: 1px) and (max-width: 768px)",
  m: "(min-width: 768px) and (max-width: 1024px)",
  l: "(min-width: 1024px) and (max-width: 1280px)",
  xl: "(min-width: 1280px) and (max-width: 1536px)",
  xxl: "(min-width: 1536px)",
};

export type WindowSize = "s" | "m" | "l" | "xl" | "xxl";
export type Layout = Record<WindowSize, PanelPosition[]>;

/**
 * Determine panel layout
 * - filter by screen size layout
 * - filter by {@link ProjectConfig.showPanels}
 */
export function usePanelLayout(): DetailPanelConfig[] {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { detailPanels, showPanels } = projectConfig;
  const { activePanels, setActivePanels } = useDetailViewStore();
  const annotations = useAnnotationStore((s) => s.annotations);
  const iiif = useMiradorStore().iiif;
  const hasFacsimile = !!iiif?.manifest;

  const filteredActivePanels = useMemo(() => {
    if (!showPanels) {
      return activePanels;
    }
    const shownPanels = new Set(showPanels(activePanels, annotations));
    return activePanels.filter((p) => shownPanels.has(p.name));
  }, [activePanels, annotations, showPanels]);

  useEffect(filterPanelsOnResize, []);

  function filterPanelsOnResize() {
    const mediaQueries = mapValues(layoutBreakpoints, (query) =>
      window.matchMedia(query),
    );

    function handleResize() {
      const windowSize = findKey(mediaQueries, (q) => q.matches) as WindowSize;

      if (!windowSize) {
        return;
      }

      const visible = filterPanelsBySize(
        detailPanels,
        hasFacsimile,
        windowSize,
      );

      const currentPanels = useDetailViewStore.getState().activePanels;
      setActivePanels(
        currentPanels.map((panel) => ({
          ...panel,
          visible: visible.includes(panel.name),
        })),
      );
    }

    handleResize();

    Object.values(mediaQueries).forEach((mq) =>
      mq.addEventListener("change", handleResize),
    );

    return () => {
      Object.values(mediaQueries).forEach((mq) =>
        mq.removeEventListener("change", handleResize),
      );
    };
  }

  return filteredActivePanels;
}

function filterPanelsBySize(
  detailPanels: DetailPanelConfig[],
  hasFacsimile: boolean,
  windowSize: WindowSize,
): string[] {
  const layout = hasFacsimile ? layouts.withFacsimile : layouts.default;
  const panels = layout[windowSize];

  const configPanelNames = panels
    .map((layoutPanelName) => {
      const panelIndex = panelToIndex[layoutPanelName];
      return detailPanels[panelIndex]?.name;
    })
    .filter((configPanelName) => !!configPanelName);

  return uniq(configPanelNames);
}
