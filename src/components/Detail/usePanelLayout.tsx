import { useEffect, useMemo } from "react";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store.ts";
import { useMiradorStore } from "../../stores/mirador";
import { findViewText } from "../Text/useViewText.tsx";
import { orThrow } from "../Text/Annotated/project/utils/orThrow.tsx";
import { ProjectConfig } from "../../model/ProjectConfig.ts";
import { findKey, mapValues } from "lodash";
import uniq from "lodash/uniq";

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

export const panelSizes: Record<WindowSize, string> = {
  s: "(min-width: 1px) and (max-width: 768px)",
  m: "(min-width: 768px) and (max-width: 1024px)",
  l: "(min-width: 1024px) and (max-width: 1280px)",
  xl: "(min-width: 1280px) and (max-width: 1536px)",
  xxl: "(min-width: 1536px)",
};

export type WindowSize = "s" | "m" | "l" | "xl" | "xxl";
export type PanelPosition = "facsimile" | "second" | "third" | "fourth";
export type Layout = Record<WindowSize, PanelPosition[]>;

/**
 * Filter panels from project config
 * - Are panels visible as per screen size layout?
 * - Filter out text panels
 */
export function usePanelLayout() {
  const { detailPanels } = useProjectStore(projectConfigSelector);
  const { activePanels, setActivePanels } = useDetailViewStore();
  const textViews = useTextStore((state) => state.views);
  const iiif = useMiradorStore().iiif;
  const hasFacsimile = !!iiif?.manifest;

  const filteredPanels = useMemo(() => {
    const textPanelsVisibility = deduplicateTextPanels(detailPanels, textViews);

    return detailPanels.filter((panel) => {
      if (panel.name in textPanelsVisibility) {
        return textPanelsVisibility[panel.name];
      } else {
        // Show all non-text panels:
        return true;
      }
    });
  }, []);

  useEffect(filterPanelsOnResize, []);

  function filterPanelsOnResize() {
    const mediaQueries = mapValues(panelSizes, (query) =>
      window.matchMedia(query),
    );

    function handleResize() {
      const windowSize =
        (findKey(mediaQueries, (q) => q.matches) as WindowSize) ??
        orThrow("No window size");

      const active = filterPanelsBySize(detailPanels, hasFacsimile, windowSize);

      setActivePanels(
        activePanels.map((panel) => ({
          ...panel,
          visible: active.includes(panel.name),
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

  return filteredPanels;
}

function filterPanelsBySize(
  detailPanels: ProjectConfig["detailPanels"],
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

/**
 * Do not show multiple text panels with the same body
 * I.e, when orig and trans have the same text body only include the first
 */
function deduplicateTextPanels(
  detailPanels: ProjectConfig["detailPanels"],
  textViews: ReturnType<typeof useTextStore.getState>["views"],
): Record<string, boolean> {
  const visibleBodies = new Set<string>();
  const allTextPanels: Record<string, boolean> = {};

  for (const panel of detailPanels) {
    const viewsToRender = panel.panel.content.props.viewToRender;
    if (!viewsToRender) {
      // Not a text panel:
      continue;
    }

    const text = findViewText(textViews, viewsToRender) ?? orThrow("No text");
    allTextPanels[panel.name] = !visibleBodies.has(text.body);
    visibleBodies.add(text.body);
  }

  return allTextPanels;
}
