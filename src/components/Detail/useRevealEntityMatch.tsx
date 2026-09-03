import { useEffect } from "react";
import { useTextStore } from "../../stores/text/text-store.ts";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";

const SCROLL_CONTAINER_ID = "panelsContainer";

/**
 * Reveal and scroll to the entity match resolved in {@link useInitDetail}.
 *
 * Reveals the location holding the first match — a main-area panel via a
 * transient visibility override, or a sidebar tab — then scrolls to the
 * anchored highlight. The anchor may not exist yet: text lazy-renders, so a
 * match beyond the first screenful only appears after an idle callback. A
 * MutationObserver waits for it, mirroring {@link useSyncHeaderWithHash}.
 */
export function useRevealEntityMatch(): void {
  const target = useTextStore((state) => state.entityMatchTarget);
  const { entityMatchLocations } = useProjectStore(projectConfigSelector);
  const setPanelVisibilityOverrides = useDetailViewStore(
    (state) => state.setPanelVisibilityOverrides,
  );
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

    const location = entityMatchLocations?.find((l) => l.name === target.name);
    if ((location?.kind ?? "panel") === "tab") {
      setActiveSidebarTab(target.name);
    } else {
      // Replace wholesale so a previous letter's reveal never lingers
      setPanelVisibilityOverrides({ [target.name]: true });
    }

    return scrollToWhenPresent(target.bodyId);
  }, [
    target,
    entityMatchLocations,
    setPanelVisibilityOverrides,
    resetPanelVisibilityOverrides,
    setActiveSidebarTab,
  ]);
}

function scrollToWhenPresent(elementId: string): () => void {
  const scroll = (): boolean => {
    const element = document.getElementById(elementId);
    if (!element) {
      return false;
    }
    // Defer a frame so a just-revealed panel has taken its grid width before
    // we measure where to scroll
    requestAnimationFrame(() =>
      element.scrollIntoView({ behavior: "smooth", block: "center" }),
    );
    return true;
  };

  if (scroll()) {
    return () => {};
  }

  const container =
    document.getElementById(SCROLL_CONTAINER_ID) ?? document.body;
  const observer = new MutationObserver(() => {
    if (scroll()) {
      cleanup();
    }
  });
  observer.observe(container, { childList: true, subtree: true });

  // The full text lazy-renders within ~1s; stop watching well after that
  const timeoutId = window.setTimeout(cleanup, 4000);

  function cleanup() {
    observer.disconnect();
    window.clearTimeout(timeoutId);
  }

  return cleanup;
}
