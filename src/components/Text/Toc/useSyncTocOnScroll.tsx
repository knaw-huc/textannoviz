import { RefObject, useEffect } from "react";
import { useTextStore } from "../../../stores/text/text-store.ts";

export const tocScrollHeader = "toc-header";

export function useSyncTocOnScroll(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  const setActiveHeader = useTextStore((s) => s.setActiveHeader);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const headerIntersections = new IntersectionObserver(
      (headers) => {
        const visible = headers
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          setActiveHeader(visible[0].target.id);
        }
      },
      { root: container, rootMargin: "0px 0px 0% 0px" },
    );

    const headers = container.querySelectorAll(`.${tocScrollHeader}`);
    headers.forEach((h) => headerIntersections.observe(h));

    // Update intersection observers when headers change:
    const headerMutations = new MutationObserver(() => {
      headerIntersections.disconnect();
      const updated = container.querySelectorAll(`.${tocScrollHeader}`);
      updated.forEach((h) => headerIntersections.observe(h));
    });
    headerMutations.observe(container, { childList: true, subtree: true });

    return () => {
      headerIntersections.disconnect();
      headerMutations.disconnect();
    };
  }, [scrollContainerRef, setActiveHeader]);
}
