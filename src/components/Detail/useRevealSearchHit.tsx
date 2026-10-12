import { useEffect } from "react";
import { useRevealPanel } from "./useRevealPanel.tsx";
import { findHitAnchor } from "../Text/Annotated/utils/hitAnchors.ts";
import { activeSearchHitSelector } from "../../stores/text/searchHitSlice.ts";
import { useTextStore } from "../../stores/text/text-store.ts";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";

const SCROLL_CONTAINER_ID = "panelsContainer";

/** Frames to wait for a revealed panel to be laid out before giving up */
const MAX_LAYOUT_FRAMES = 30;

/** The full text lazy-renders within ~1s; stop watching well after that */
const WATCH_TIMEOUT_MS = 4000;

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
 */
export function useRevealSearchHit(): void {
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

  useEffect(() => {
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

    return scrollToWhenPresent(target.anchor);
  }, [
    target,
    revealCount,
    searchHitLocations,
    revealPanel,
    resetPanelVisibilityOverrides,
    setActiveSidebarTab,
  ]);
}

/**
 * Scroll to an anchor that is not on screen yet, and may not exist yet.
 *
 * Two separate waits, because revealing a location is not instant:
 * - the anchor has to be in the DOM. Text lazy-renders, so a match beyond
 *   the first screenful only appears after an idle callback, and a sidebar
 *   tab only mounts its panel once selected. A MutationObserver watches for
 *   it, mirroring {@link useSyncHeaderWithHash}.
 * - the anchor has to be laid out. A panel revealed by this effect has no
 *   size until the browser lays it out a render or more later, and
 *   scrolling to a zero-height element silently does nothing rather than
 *   failing, so it is polled per frame the way {@link NotesPanel} does.
 *
 * @returns a cleanup that stops both waits
 */
function scrollToWhenPresent(anchor: string): () => void {
  let timeoutId = 0;
  let frameId = 0;
  let framesWaited = 0;
  let stopped = false;

  function cleanup() {
    stopped = true;
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.clearTimeout(timeoutId);
  }

  function scrollWhenLaidOut() {
    frameId = 0;
    const element = findHitAnchor(anchor);
    if (element && element.getBoundingClientRect().height > 0) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      cleanup();
      return;
    }
    if (framesWaited++ < MAX_LAYOUT_FRAMES) {
      frameId = requestAnimationFrame(scrollWhenLaidOut);
    }
  }

  /**
   * Rendering the text fires a burst of mutations; only ever keep one frame
   * in flight, and give a newly appeared anchor the full budget again.
   */
  function waitForLayout() {
    if (stopped || frameId) {
      return;
    }
    framesWaited = 0;
    frameId = requestAnimationFrame(scrollWhenLaidOut);
  }

  const observer = new MutationObserver(waitForLayout);

  waitForLayout();

  const container =
    document.getElementById(SCROLL_CONTAINER_ID) ?? document.body;
  observer.observe(container, { childList: true, subtree: true });

  timeoutId = window.setTimeout(cleanup, WATCH_TIMEOUT_MS);

  return cleanup;
}
