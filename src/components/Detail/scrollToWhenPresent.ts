const SCROLL_CONTAINER_ID = "panelsContainer";

/** Frames to wait for a revealed panel to be laid out before giving up */
const MAX_LAYOUT_FRAMES = 30;

/** The full text lazy-renders within ~1s; stop watching well after that */
const WATCH_TIMEOUT_MS = 4000;

/**
 * Scroll to an element that is not on screen yet, and may not exist yet.
 *
 * Two separate waits, because revealing a location is not instant:
 * - the element has to be in the DOM. Text lazy-renders, so an element
 *   beyond the first screenful only appears after an idle callback, and a
 *   sidebar tab only mounts its panel once selected. A MutationObserver
 *   watches for it, mirroring {@link useSyncHeaderWithHash}.
 * - the element has to be laid out. A panel revealed just before has no
 *   size until the browser lays it out a render or more later, and
 *   scrolling to a zero-height element silently does nothing rather than
 *   failing, so it is polled per frame the way {@link NotesPanel} does.
 *
 * @param find looks up the element, called again on every change
 * @param onScrolled called with the element once it is scrolled to
 * @returns a cleanup that stops both waits
 */
export function scrollToWhenPresent(
  find: () => Element | null,
  onScrolled?: (element: Element) => void,
): () => void {
  let timeoutId = 0;
  let frameId = 0;
  let framesWaited = 0;
  let stopped = false;

  function cleanup() {
    stopped = true;
    cancelAnimationFrame(frameId);
    observer.disconnect();
    window.clearTimeout(timeoutId);
  }

  function scrollWhenLaidOut() {
    frameId = 0;
    const element = find();
    if (element && element.getBoundingClientRect().height > 0) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      onScrolled?.(element);
      cleanup();
      return;
    }
    if (framesWaited++ < MAX_LAYOUT_FRAMES) {
      frameId = requestAnimationFrame(scrollWhenLaidOut);
    }
  }

  /**
   * Rendering the text fires a burst of mutations; only ever keep one frame
   * in flight, and give a newly appeared element the full budget again.
   */
  function waitForLayout() {
    if (stopped || frameId) {
      return;
    }
    framesWaited = 0;
    frameId = requestAnimationFrame(scrollWhenLaidOut);
  }

  const observer = new MutationObserver(waitForLayout);

  waitForLayout();

  const container =
    document.getElementById(SCROLL_CONTAINER_ID) ?? document.body;
  observer.observe(container, { childList: true, subtree: true });

  timeoutId = window.setTimeout(cleanup, WATCH_TIMEOUT_MS);

  return cleanup;
}
