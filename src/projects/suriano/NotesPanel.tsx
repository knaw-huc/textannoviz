import { createNoteLines } from "../../components/Text/Annotated/MarkerTooltip";
import {
  AnnoRepoAnnotation,
  isNoteBody,
  NoteBody,
} from "../../model/AnnoRepoAnnotation";
import { useTextStore } from "../../stores/text";

type NotesPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export function NotesPanel(props: NotesPanelProps) {
  const textPanels = useTextStore((state) => state.views);
  const { scrollToFootnote } = useTextStore();
  if (!textPanels) return;
  const notesView = textPanels["notes"];

  const footnoteAnnotations = props.annotations.filter((anno) => {
    //Annotation type 'tei:Note' contains different types of notes: editorial notes, general notes, footnotes. Only footnotes have 'body.metadata["tei:id"]', so that's used here to filter out the footnotes.
    return isNoteBody(anno.body) && anno.body.metadata["tei:id"];
  });

  const footnotes = footnoteAnnotations.flatMap((noteAnno) => {
    return {
      id: (noteAnno.body as NoteBody).metadata["tei:id"],
      lines: createNoteLines(notesView, noteAnno.body.id),
    };
  });

  return (
    <>
      {footnotes.length ? (
        footnotes.map((footnote, index) => (
          <button
            className={`mb-2 cursor-pointer bg-white hover:underline`}
            key={index}
            onClick={() => scrollToFootnote(footnote.id)}
          >
            {footnote.lines}
          </button>
        ))
      ) : (
        <div>This letter has no footnotes.</div>
      )}
    </>
  );
}
