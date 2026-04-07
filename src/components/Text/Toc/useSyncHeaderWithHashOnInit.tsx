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

    const selector = `#${CSS.escape(hash)}`;
    const header = container.querySelector(selector);
    if (header) {
      header.scrollIntoView();
      return;
    }

    const observer = new MutationObserver(() => {
      const header = container.querySelector(selector);
      if (header) {
        header.scrollIntoView();
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [scrollContainerRef]);
}
