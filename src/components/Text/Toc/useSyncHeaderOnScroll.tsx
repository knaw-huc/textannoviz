import { RefObject, useEffect } from "react";
import { useTextStore } from "../../../stores/text/text-store.ts";

export const tocScrollHeader = "toc-header";

export function useSyncHeaderOnScroll(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  const setActiveHeader = useTextStore((s) => s.setActiveHeader);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    const visibleHeaderIds = new Set<string>();

    const headerIntersections = new IntersectionObserver(
      (events) => {
        for (const event of events) {
          if (event.isIntersecting) {
            visibleHeaderIds.add(event.target.id);
          } else {
            visibleHeaderIds.delete(event.target.id);
          }
        }

        const allHeaders = container.querySelectorAll(`.${tocScrollHeader}`);
        let lowest: string | undefined;
        for (const h of allHeaders) {
          if (visibleHeaderIds.has(h.id)) {
            lowest = h.id;
          }
        }
        if (lowest) {
          setActiveHeader(lowest);
        }
      },
      { root: container },
    );

    const headers = container.querySelectorAll(`.${tocScrollHeader}`);
    headers.forEach((h) => headerIntersections.observe(h));

    // Update intersection observers when headers change:
    const headerMutations = new MutationObserver(() => {
      visibleHeaderIds.clear();
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
