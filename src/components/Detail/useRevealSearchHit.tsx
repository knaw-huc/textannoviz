import { useEffect, useRef } from "react";
import { useRevealPanel } from "./useRevealPanel.tsx";
import { findHitAnchor } from "../Text/Annotated/utils/hitAnchors.ts";
import { scrollToWhenPresent } from "./scrollToWhenPresent.ts";
import { activeSearchHitSelector } from "../../stores/text/searchHitSlice.ts";
import { useTextStore } from "../../stores/text/text-store.ts";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";

/**
 * Reveal and scroll to the active search hit.
 *
 * Reveals the location holding it — a main-area panel via a transient
 * visibility override, or a sidebar tab — then scrolls to the anchored
 * highlight. Both steps take effect a render later than this one, so
 * {@link scrollToWhenPresent} waits the anchor out rather than assuming it
 * is there.
 *
 * Runs on the active match rather than on load, so that picking another
 * match from a list reveals it the same way {@link useInitDetail} revealed
 * the first.
 *
 * @param skipAutoReveal leave the first hit alone until the reader picks one,
 *   as the letter was opened to reveal something else
 */
export function useRevealSearchHit(skipAutoReveal = false): void {
  const target = useTextStore(activeSearchHitSelector);
  // Not read, only a dependency: picking the active match again re-reveals it
  const revealCount = useTextStore((state) => state.searchHitRevealCount);
  const { searchHitLocations } = useProjectStore(projectConfigSelector);
  const revealPanel = useRevealPanel();
  const resetPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.resetPanelVisibilityOverrides,
  );
  const setActiveSidebarTab = useDetailViewStore(
    (state) => state.setActiveSidebarTab,
  );
  const isSkippingAutoReveal = useRef(skipAutoReveal);
  const prevRevealCount = useRef(revealCount);

  useEffect(() => {
    // A pick bumps the reveal count; anything else rerunning this is not one
    const isPick = revealCount !== prevRevealCount.current;
    prevRevealCount.current = revealCount;
    if (isPick) {
      isSkippingAutoReveal.current = false;
    }
    if (isSkippingAutoReveal.current) {
      // Not even resetting overrides: those reveal what is revealed instead
      return;
    }

    if (!target) {
      resetPanelVisibilityOverrides();
      return;
    }

    const location = searchHitLocations?.find((l) => l.name === target.name);
    if ((location?.kind ?? "panel") === "tab") {
      revealPanel(location?.panel ?? "metadata");
      setActiveSidebarTab(target.name);
    } else {
      revealPanel(target.name);
    }

    return scrollToWhenPresent(() => findHitAnchor(target.anchor));
  }, [
    target,
    revealCount,
    searchHitLocations,
    revealPanel,
    resetPanelVisibilityOverrides,
    setActiveSidebarTab,
  ]);
}
