import { useCallback } from "react";
import { useRevealPanel } from "./useRevealPanel.tsx";
import { scrollToWhenPresent } from "./scrollToWhenPresent.ts";

const highlightMarker = "revealedElementHighlight";
const highlightClasses = [
  highlightMarker,
  "bg-yellow-200",
  // Extend the background beyond the text without shifting the layout:
  "ring-8",
  "ring-yellow-200",
  "rounded-sm",
  "transition-all",
  "duration-300",
  "w-fit",
];

export function clearRevealedElementHighlights() {
  document
    .querySelectorAll(`.${highlightMarker}`)
    .forEach((element) => element.classList.remove(...highlightClasses));
}

/**
 * Reveal the panel holding an element, then scroll to and highlight it.
 *
 * Reveals first: on a narrow screen the panel may not be shown, in which case
 * the element is not rendered at all until it is. Only one element is
 * highlighted at a time.
 *
 * @returns a cleanup that stops waiting for the element
 */
export function useRevealElement(): (
  elementId: string,
  panel: string,
) => () => void {
  const revealPanel = useRevealPanel();

  return useCallback(
    (elementId: string, panel: string) => {
      revealPanel(panel);
      clearRevealedElementHighlights();
      return scrollToWhenPresent(
        () => document.getElementById(elementId),
        (element) => element.classList.add(...highlightClasses),
      );
    },
    [revealPanel],
  );
}
