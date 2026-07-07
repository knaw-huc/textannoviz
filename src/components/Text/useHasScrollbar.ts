import { DependencyList, RefObject, useEffect, useState } from "react";

/**
 * Tracks whether the referenced element overflows vertically by more than
 * `thresholdPx`. The threshold lets a barely-there scrollbar count as "fully
 * visible", so callers can avoid reacting to a negligible amount of overflow.
 *
 * A `ResizeObserver` only fires on changes to the element's own box, not on
 * content-driven `scrollHeight` changes, so pass anything that changes the
 * content (e.g. the loaded text) via `deps` to force a re-check.
 */
export function useHasScrollbar<T extends HTMLElement>(
  ref: RefObject<T | null>,
  thresholdPx = 0,
  deps: DependencyList = [],
) {
  const [hasScrollbar, setHasScrollbar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () =>
      setHasScrollbar(el.scrollHeight - el.clientHeight > thresholdPx);

    update();

    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, thresholdPx, ...deps]);

  return hasScrollbar;
}
