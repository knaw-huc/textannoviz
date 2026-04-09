import { useEffect } from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useMiradorStore } from "../../stores/mirador";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import { findKey, mapValues } from "lodash";
import { useAnnotationStore } from "../../stores/annotation.ts";

/**
 * Panel indices from detailPanels config to show at each breakpoint
 */
export const layouts = {
  default: {
    s: [1],
    m: [1, 3],
    l: [1, 3],
    xl: [1, 3],
    xxl: [1, 2, 3],
  },
  withFacsimile: {
    s: [1],
    m: [1, 3],
    l: [0, 1, 3],
    xl: [0, 1, 3],
    xxl: [0, 1, 2, 3],
  },
} satisfies Record<string, Layout>;

export const layoutBreakpoints: Record<WindowSize, string> = {
  s: "(min-width: 1px) and (max-width: 768px)",
  m: "(min-width: 768px) and (max-width: 1024px)",
  l: "(min-width: 1024px) and (max-width: 1280px)",
  xl: "(min-width: 1280px) and (max-width: 1536px)",
  xxl: "(min-width: 1536px)",
};

export type WindowSize = "s" | "m" | "l" | "xl" | "xxl";
export type Layout = Record<WindowSize, number[]>;

/**
 * Determine panel layout
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
  const indices = layout[windowSize];

  return indices.map((i) => detailPanels[i]?.name).filter((name) => !!name);
}
