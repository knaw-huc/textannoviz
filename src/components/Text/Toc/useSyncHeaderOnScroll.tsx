import { RefObject, useEffect } from "react";
import { useTextStore } from "../../../stores/text/text-store.ts";

export const tocScrollHeader = "toc-header";

export function useSyncHeaderOnScroll(
  scrollContainerRef: RefObject<HTMLElement | null>,
): void {
  const setActiveHeader = useTextStore((s) => s.setActiveHeader);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) {
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

        // Keep current header when still in view:
        const current = useTextStore.getState().activeHeader;
        if (current && visibleHeaderIds.has(current)) {
          return;
        }

        const headers = scrollContainer.querySelectorAll(`.${tocScrollHeader}`);

        let lowestId: string | undefined;

        // Pick lowest visible header:
        for (const h of headers) {
          if (visibleHeaderIds.has(h.id)) {
            lowestId = h.id;
          }
        }

        // When no headers visible, pick header above viewport:
        if (!lowestId) {
          const containerTop = scrollContainer.getBoundingClientRect().top;
          for (const h of headers) {
            if (h.getBoundingClientRect().top < containerTop) {
              lowestId = h.id;
            }
          }
        }

        if (lowestId) {
          setActiveHeader(lowestId);
        }
      },
      { root: scrollContainer },
    );

    const headers = scrollContainer.querySelectorAll(`.${tocScrollHeader}`);
    headers.forEach((h) => headerIntersections.observe(h));

    // Update intersection observers when headers change:
    const headerMutations = new MutationObserver(() => {
      visibleHeaderIds.clear();
      headerIntersections.disconnect();
      const updated = scrollContainer.querySelectorAll(`.${tocScrollHeader}`);
      updated.forEach((h) => headerIntersections.observe(h));
    });
    headerMutations.observe(scrollContainer, {
      childList: true,
      subtree: true,
    });

    return () => {
      headerIntersections.disconnect();
      headerMutations.disconnect();
    };
  }, [scrollContainerRef, setActiveHeader]);
}
