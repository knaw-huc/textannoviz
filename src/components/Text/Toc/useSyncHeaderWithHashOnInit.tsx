import { RefObject, useEffect, useState } from "react";
import { getUrlHash } from "../../../utils/url/UrlHashUtils.ts";

export function useSyncHeaderWithHashOnInit(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  const imageLoaded = useLastImageLoaded(scrollContainerRef);

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
      setTimeout(() => header.scrollIntoView({ block: "start" }), 1000);
      return;
    }

    const observer = new MutationObserver(() => {
      const header = container.querySelector(selector);
      if (header) {
        setTimeout(() => header.scrollIntoView({ block: "start" }), 1000);
        observer.disconnect();
      }
    });
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [scrollContainerRef, imageLoaded]);
}

/**
 * Track image loads inside the container to observe image loading
 */
export function useLastImageLoaded(
  containerRef: RefObject<HTMLElement | null>,
): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onLoad = (e: Event) => {
      if (e.target instanceof HTMLImageElement) {
        setImage(e.target);
      }
    };
    container.addEventListener("load", onLoad, true);
    return () => container.removeEventListener("load", onLoad, true);
  }, [containerRef]);

  return image;
}
