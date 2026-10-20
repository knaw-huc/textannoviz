import { PropsWithChildren } from "react";
import { useSelectNote } from "../../../../components/Detail/useSelectNote.ts";

/**
 * A link to a note in the same letter, e.g. "#note-t-3", which selects it as
 * clicking its marker does. A link to a note in another letter is a
 * {@link LetterLink}, which opens that letter on the note.
 */
export function NoteReferenceLink(
  props: PropsWithChildren<{ noteId: string; className?: string }>,
) {
  const { noteId, className, children } = props;
  const selectNote = useSelectNote();

  function go() {
    selectNote(noteId);
  }

  return (
    <span
      className={`closedNestedAnnotation cursor-pointer ${className ?? ""}`}
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === "Enter") go();
      }}
    >
      {children}
    </span>
  );
}
