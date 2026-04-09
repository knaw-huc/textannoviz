import { useEffect } from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useMiradorStore } from "../../stores/mirador";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import { findKey, mapValues } from "lodash";
import { useAnnotationStore } from "../../stores/annotation.ts";

/**
 * Panels from detailPanels config to show at each screen size
 */
export const layouts: Record<string, Layout> = {
  default: {
    s: ["original"],
    m: ["original", "metadata"],
    l: ["original", "metadata"],
    xl: ["original", "metadata"],
    xxl: ["original", "translation", "metadata"],
  },
  withFacsimile: {
    s: ["original"],
    m: ["original", "metadata"],
    l: ["facsimile", "original", "metadata"],
    xl: ["facsimile", "original", "metadata"],
    xxl: ["facsimile", "original", "translation", "metadata"],
  },
};

export const layoutBreakpoints: Record<WindowSize, string> = {
  s: "(min-width: 1px) and (max-width: 768px)",
  m: "(min-width: 768px) and (max-width: 1024px)",
  l: "(min-width: 1024px) and (max-width: 1280px)",
  xl: "(min-width: 1280px) and (max-width: 1536px)",
  xxl: "(min-width: 1536px)",
};

export type PanelName = "facsimile" | "original" | "translation" | "metadata";
export type WindowSize = "s" | "m" | "l" | "xl" | "xxl";
export type Layout = Record<WindowSize, PanelName[]>;

const panelNameToIndex: Record<PanelName, number> = {
  facsimile: 0,
  original: 1,
  translation: 2,
  metadata: 3,
};

/**
 * Determine panel layout by setting active panels
 * - filter by screen size layout, also on resize
 * - filter by {@link ProjectConfig.filterPanels}
 */
export function usePanelLayout(): null {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { filterPanels } = projectConfig;
  const { activePanels, setActivePanels } = useDetailViewStore();
  const annotations = useAnnotationStore((s) => s.annotations);
  const hasFacsimile = !!useMiradorStore((s) => s.iiif?.manifest);

  useEffect(filterPanelsOnResize, [hasFacsimile]);

  function filterPanelsOnResize() {
    const mediaQueries = mapValues(layoutBreakpoints, (query) =>
      window.matchMedia(query),
    );

    function handleResize() {
      const windowSize = findKey(mediaQueries, (q) => q.matches) as WindowSize;

      if (!windowSize) {
        return;
      }

      const filteredByProject =
        filterPanels?.(activePanels, annotations) ??
        activePanels.map((a) => a.name);
      const filteredBySize = isVisibleInLayout(
        activePanels,
        hasFacsimile,
        windowSize,
      );

      setActivePanels(
        activePanels.map((panel) => ({
          ...panel,
          visible:
            filteredByProject.includes(panel.name) &&
            filteredBySize.includes(panel.name),
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

  return null;
}

function isVisibleInLayout(
  detailPanels: DetailPanelConfig[],
  hasFacsimile: boolean,
  windowSize: WindowSize,
): string[] {
  const layout = hasFacsimile ? layouts.withFacsimile : layouts.default;
  const panelNames = layout[windowSize];
  return panelNames
    .map((name) => detailPanels[panelNameToIndex[name]]?.name)
    .filter((name) => !!name);
}
