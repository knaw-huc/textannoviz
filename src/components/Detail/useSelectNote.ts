import { useCallback } from "react";
import { useRevealPanel } from "./useRevealPanel.tsx";
import { useAnnotationStore } from "../../stores/annotation.ts";
import { useDetailViewStore } from "../../stores/detail-view/detail-view-store.ts";
import { useTextStore } from "../../stores/text/text-store.ts";

/**
 * Select a note as a note marker click does: show the notes tab and
 * highlight the note, both in the text and in the panel.
 *
 * @returns a select function, taking the note's xml:id (without '#'), that
 *   says whether the letter has such a note
 */
export function useSelectNote(): (noteId: string) => boolean {
  const setActiveFootnote = useTextStore((state) => state.setActiveFootnote);
  const setActiveSidebarTab = useDetailViewStore(
    (state) => state.setActiveSidebarTab,
  );
  const revealPanel = useRevealPanel();

  return useCallback(
    (noteId: string) => {
      // Read, not subscribed: the map is only needed at the moment of selecting
      const { ptrToNoteAnnosMap } = useAnnotationStore.getState();
      const footnoteNumber = ptrToNoteAnnosMap.get(`#${noteId}`)?.body.n;
      if (!footnoteNumber) {
        return false;
      }
      revealPanel("metadata");
      setActiveSidebarTab("notes");
      setActiveFootnote(footnoteNumber);
      return true;
    },
    [revealPanel, setActiveSidebarTab, setActiveFootnote],
  );
}
