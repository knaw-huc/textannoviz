import { RefObject, useEffect } from "react";
import { getUrlHash } from "../../../utils/url/UrlHashUtils.ts";

export function useScrollToHashOnInit(
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

    const selector = `#${CSS.escape(hash)}`;
    const el = container.querySelector(selector);
    if (el) {
      el.scrollIntoView();
      return;
    }

    const observer = new MutationObserver(() => {
      const found = container.querySelector(selector);
      if (found) {
        found.scrollIntoView();
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [scrollContainerRef]);
}
