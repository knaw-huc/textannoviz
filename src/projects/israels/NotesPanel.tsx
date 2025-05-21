import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { createNoteLines } from "../../components/Text/Annotated/MarkerTooltip";
import { AnnoRepoAnnotation, NoteBody } from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const textPanels = useTextStore().views;
  const annotations = useAnnotationStore().annotations;

  if (!textPanels) return;

  const noteText = textPanels["textNotes"];

  const dutchFootnotes = getFootnotes(annotations);

  const notes = createFootnotes(dutchFootnotes, noteText);

  return (
    <div role="notespanel">
      {notes.map((note, index) => (
        <div key={index} className="flex flex-row">
          <span className="mr-4 text-sm text-neutral-500">
            {note.footnoteNumber}.{" "}
          </span>
          <div className="mb-4 text-sm">
            <AnnotatedText text={note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};

function getFootnotes(annotations: AnnoRepoAnnotation[]) {
  return annotations.reduce(
    (unique, anno) => {
      const isNumber = (str: string) => /^\d+$/.test(str);
      if (
        anno.body.type === "tei:Note" &&
        (anno.body as NoteBody).metadata.n &&
        //Footnotes with 'a', 'b', etc. are currently not in views.textNotes
        isNumber((anno.body as NoteBody).metadata.n) &&
        //Only use NL notes for now
        (anno.body as NoteBody).metadata.lang === "nl" &&
        //There is some duplication in TAV now because of the 'notes' view also being added in the Detail component for the note tooltips.
        !unique.some((existingAnno) => existingAnno.body.id === anno.body.id)
      ) {
        unique.push(anno);
      }
      return unique;
    },
    [] as typeof annotations,
  );
}

function createFootnotes(
  footnotes: AnnoRepoAnnotation[],
  notesText: BroccoliTextGeneric,
) {
  return footnotes.map((footnote) => {
    const line = createNoteLines(notesText, footnote.body.id);

    const lineIndex = notesText.lines.indexOf(line[0]);

    const annos = notesText.locations.annotations
      .filter((anno) => anno.start.line === lineIndex)
      .map((anno) => ({
        bodyId: anno.bodyId,
        start: {
          line: 0,
          offset: anno.start.offset,
        },
        end: {
          line: 0,
          offset: anno.end.offset,
        },
      }));

    const locs = {
      relativeTo: notesText.locations.relativeTo,
      annotations: annos,
    };

    return {
      lines: line,
      locations: locs,
      footnoteNumber: (footnote.body as NoteBody).metadata.n,
    };
  });
}
