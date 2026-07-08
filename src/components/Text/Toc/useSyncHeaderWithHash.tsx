import { RefObject, useEffect } from "react";
import { useLocation } from "react-router";

export function useSyncHeaderWithHash(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  // Read the hash from the router so the effect re-runs on in-app navigation
  // (e.g. following an internal link), not only on mount. Scroll-based header
  // syncing uses the text store rather than the URL, so this cannot feed back.
  const hash = useLocation().hash.slice(1) || null;

  useEffect(() => {
    if (!hash) {
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const headerSelector = `#${CSS.escape(hash)}`;

    const scroll = () => {
      const header = container.querySelector(headerSelector);
      if (header) {
        scrollIfNotInView(header, container);
        return true;
      }
      return false;
    };

    if (scroll()) {
      return;
    }

    const scrollOnLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        scroll();
      }
    };

    // Watch for the header to appear via DOM mutations:
    const mutationObserver = new MutationObserver(() => {
      if (scroll()) {
        cleanup();
      }
    });
    mutationObserver.observe(container, { childList: true, subtree: true });

    // Scroll on image loads:
    container.addEventListener("load", scrollOnLoad, true);

    function cleanup() {
      mutationObserver.disconnect();
      container?.removeEventListener("load", scrollOnLoad, true);
    }

    return cleanup;
  }, [scrollContainerRef, hash]);
}

function scrollIfNotInView(header: Element, container: Element): void {
  if (!isInView(header, container)) {
    setTimeout(() => header.scrollIntoView({ block: "start" }), 250);
  }
}

function isInView(element: Element, container: Element): boolean {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return (
    elementRect.top >= containerRect.top &&
    elementRect.top <= containerRect.bottom
  );
}
