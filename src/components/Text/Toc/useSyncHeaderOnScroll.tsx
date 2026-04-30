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

    // Headers visible on init are ignored:
    const initialHeaderIds = new Set<string>();
    let needsInit = true;

    const headerIntersections = new IntersectionObserver(
      (events) => {
        for (const event of events) {
          if (event.isIntersecting) {
            visibleHeaderIds.add(event.target.id);
          } else {
            visibleHeaderIds.delete(event.target.id);
          }
        }

        // First callback: snapshot which headers are already on screen:
        if (needsInit) {
          needsInit = false;
          for (const id of visibleHeaderIds) {
            initialHeaderIds.add(id);
          }
          return;
        }

        // Keep current header when still in view:
        const current = useTextStore.getState().activeHeader;
        if (current && visibleHeaderIds.has(current)) {
          return;
        }

        const headers = scrollContainer.querySelectorAll(`.${tocScrollHeader}`);

        let newId: string | undefined;

        // Pick lowest visible header:
        for (const h of headers) {
          if (visibleHeaderIds.has(h.id)) {
            newId = h.id;
            break;
          }
        }

        // When no headers visible, pick header above viewport:
        if (!newId && current) {
          const containerTop = scrollContainer.getBoundingClientRect().top;
          for (const h of headers) {
            if (h.getBoundingClientRect().top < containerTop) {
              newId = h.id;
            }
          }
        }

        if (newId) {
          if (initialHeaderIds.has(newId)) {
            setActiveHeader("");
          } else {
            setActiveHeader(newId);
          }
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
