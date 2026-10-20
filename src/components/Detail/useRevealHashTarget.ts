import { useEffect, useState } from "react";
import { getUrlHash } from "../../utils/url/UrlHashUtils.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";
import {
  clearRevealedElementHighlights,
  useRevealElement,
} from "./useRevealElement.ts";
import { useSelectNote } from "./useSelectNote.ts";

type HashTarget =
  | { kind: "note"; noteId: string }
  | { kind: "element"; elementId: string; panel: string };

/**
 * Reveal what the url hash points at: a note of the letter, which is
 * selected, or an element in a panel the project names, which is scrolled to
 * and highlighted: see {@link ProjectConfig.getHashTargetPanel}.
 *
 * Reads the hash once, when the letter's panels mount: the ToC rewrites the
 * hash to its active header as the reader scrolls, so it cannot be relied on
 * to still name the target later. The panels only mount once the letter's
 * notes are known.
 *
 * @returns whether there is such a target, so other reveals can stand back
 */
export function useRevealHashTarget(): boolean {
  const { getHashTargetPanel } = useProjectStore(projectConfigSelector);
  const revealElement = useRevealElement();
  const selectNote = useSelectNote();
  const [target] = useState((): HashTarget | undefined => {
    const hash = getUrlHash();
    if (!hash) {
      return;
    }
    const { ptrToNoteAnnosMap } = useAnnotationStore.getState();
    if (ptrToNoteAnnosMap.has(`#${hash}`)) {
      return { kind: "note", noteId: hash };
    }
    const panel = getHashTargetPanel?.(hash);
    return panel ? { kind: "element", elementId: hash, panel } : undefined;
  });

  useEffect(() => {
    if (!target) {
      return;
    }
    if (target.kind === "note") {
      // Scrolled to by the notes panel, which shows the selected note
      selectNote(target.noteId);
      return;
    }
    const stopScrolling = revealElement(target.elementId, target.panel);
    return () => {
      stopScrolling();
      clearRevealedElementHighlights();
    };
  }, [target, revealElement, selectNote]);

  return !!target;
}
