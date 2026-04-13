import { useEffect } from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useMiradorStore } from "../../stores/mirador";
import { DetailPanelConfig, PanelRegion } from "../../model/ProjectConfig.ts";
import { findKey, mapValues } from "lodash";
import { useAnnotationStore } from "../../stores/annotation.ts";

export type WindowSize = "s" | "m" | "l" | "xl" | "xxl";

/**
 * Which panel regions to show at each screen size
 */
export const layout: Record<WindowSize, PanelRegion[]> = {
  s: ["main"],
  m: ["main", "right"],
  l: ["left", "main", "right"],
  xl: ["left", "main", "right"],
  xxl: ["left", "main", "main", "right"],
};

export const layoutBreakpoints: Record<WindowSize, string> = {
  s: "(min-width: 1px) and (max-width: 768px)",
  m: "(min-width: 768px) and (max-width: 1024px)",
  l: "(min-width: 1024px) and (max-width: 1280px)",
  xl: "(min-width: 1280px) and (max-width: 1536px)",
  xxl: "(min-width: 1536px)",
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
  const hasManifest = !!useMiradorStore((s) => s.iiif?.manifest);

  useEffect(filterPanelsOnResize, [hasManifest]);

  function filterPanelsOnResize() {
    const mediaQueries = mapValues(layoutBreakpoints, (query) =>
      window.matchMedia(query),
    );

    function handleResize() {
      const windowSize = findKey(mediaQueries, (q) => q.matches) as WindowSize;

      if (!windowSize) {
        return;
      }

      const filteredByProject = filterPanels
        ? filterPanels(activePanels, annotations)
        : activePanels.map((a) => a.name);

      const filteredBySize = isVisibleInLayout(activePanels, windowSize);

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
  windowSize: WindowSize,
): string[] {
  const panelRegions = layout[windowSize];
  const usedPanels = new Set<string>();
  const visiblePanels: string[] = [];

  for (const region of panelRegions) {
    const foundPanel = detailPanels.find(
      (p) => p.region === region && !usedPanels.has(p.name),
    );
    if (foundPanel) {
      usedPanels.add(foundPanel.name);
      visiblePanels.push(foundPanel.name);
    }
  }

  return visiblePanels;
}
