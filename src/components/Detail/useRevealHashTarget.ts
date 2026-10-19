import { useEffect, useState } from "react";
import { getUrlHash } from "../../utils/url/UrlHashUtils.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  clearRevealedElementHighlights,
  useRevealElement,
} from "./useRevealElement.ts";

/**
 * Reveal the element the url hash points at, when the project says which
 * panel holds it: see {@link ProjectConfig.getHashTargetPanel}.
 *
 * Reads the hash once, when the letter's panels mount: the ToC rewrites the
 * hash to its active header as the reader scrolls, so it cannot be relied on
 * to still name the target later.
 *
 * @returns whether there is such a target, so other reveals can stand back
 */
export function useRevealHashTarget(): boolean {
  const { getHashTargetPanel } = useProjectStore(projectConfigSelector);
  const revealElement = useRevealElement();
  const [target] = useState(() => {
    const elementId = getUrlHash();
    const panel = elementId && getHashTargetPanel?.(elementId);
    return elementId && panel ? { elementId, panel } : undefined;
  });

  useEffect(() => {
    if (!target) {
      return;
    }
    const stopScrolling = revealElement(target.elementId, target.panel);
    return () => {
      stopScrolling();
      clearRevealedElementHighlights();
    };
  }, [target, revealElement]);

  return !!target;
}
