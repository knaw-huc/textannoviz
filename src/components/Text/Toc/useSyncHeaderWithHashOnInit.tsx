import { RefObject, useEffect } from "react";
import { getUrlHash } from "../../../utils/url/UrlHashUtils.ts";

export function useSyncHeaderWithHashOnInit(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const hash = getUrlHash();
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
  }, [scrollContainerRef]);
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
