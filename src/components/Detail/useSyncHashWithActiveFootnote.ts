import { useEffect } from "react";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { useTextStore } from "../../stores/text/text-store.ts";
import {
  clearUrlHash,
  getUrlHash,
  setUrlHash,
} from "../../utils/url/UrlHashUtils.ts";

/**
 * Keep the selected note in the url hash, as its xml:id, so a letter can be
 * linked to and reloaded on a note: {@link useRevealHashTarget} selects it
 * again on load.
 *
 * Replaces rather than pushes the url, as the ToC does. Only clears a hash
 * naming a note, leaving one that points elsewhere, e.g. at a paragraph.
 */
export function useSyncHashWithActiveFootnote(): void {
  const activeFootnote = useTextStore((state) => state.activeFootnote);
  const ptrToNoteAnnosMap = useAnnotationStore(
    (state) => state.ptrToNoteAnnosMap,
  );

  useEffect(() => {
    if (activeFootnote) {
      const ptr = [...ptrToNoteAnnosMap].find(
        ([, note]) => note.body.n === activeFootnote,
      )?.[0];
      if (ptr) {
        setUrlHash(ptr.slice(1));
      }
      return;
    }
    const hash = getUrlHash();
    if (hash && ptrToNoteAnnosMap.has(`#${hash}`)) {
      clearUrlHash();
    }
  }, [activeFootnote, ptrToNoteAnnosMap]);
}
