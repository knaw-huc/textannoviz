import { useCallback } from "react";
import { pickBy } from "lodash";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import { DetailPanelConfig } from "../../model/ProjectConfig.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";

/**
 * Show a panel now, through a panel visibility override, without hiding what
 * else an override is showing.
 *
 * Replaces only the overrides of panels in the same region: those compete for
 * the same slot, where the first overridden panel would win, so keeping them
 * could leave the slot on the old panel. Overrides in other regions stay, so
 * revealing a main text does not close the sidebar the reader clicked in.
 *
 * Reads the current overrides from the store rather than subscribing, so
 * effects calling this do not rerun on the overrides they set themselves.
 */
export function useRevealPanel(): (name: string) => void {
  const { detailPanels } = useProjectStore(projectConfigSelector);
  const setPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.setPanelVisibilityOverrides,
  );

  return useCallback(
    (name: string) => {
      const { panelVisibilityOverrides } = useDetailViewStore.getState();
      setPanelVisibilityOverrides(
        addPanelOverride(panelVisibilityOverrides, name, detailPanels),
      );
    },
    [detailPanels, setPanelVisibilityOverrides],
  );
}

/**
 * The overrides with name shown, and the overrides of other panels in its
 * region dropped. See {@link useRevealPanel}.
 */
export function addPanelOverride(
  overrides: Record<string, boolean>,
  name: string,
  detailPanels: Pick<DetailPanelConfig, "name" | "region">[],
): Record<string, boolean> {
  const regionOf = (panel: string) =>
    detailPanels.find((p) => p.name === panel)?.region;
  const region = regionOf(name);
  const otherRegions = pickBy(
    overrides,
    (_, panel) => regionOf(panel) !== region,
  );
  return { ...otherRegions, [name]: true };
}
