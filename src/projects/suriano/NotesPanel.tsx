import { Button } from "react-aria-components";
import { createNoteLines } from "../../components/Detail/Text/Annotated/MarkerTooltip";
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
  const textPanels = useTextStore().views;
  const { scrollToFootnote, activeFootnote, setActiveFootnote } =
    useTextStore();

  if (!textPanels) return null;
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

  const footnoteButtonPressHandler = (footnoteId: string) => {
    scrollToFootnote(footnoteId);
    setActiveFootnote(footnoteId);
  };

  return (
    <div className="flex flex-col items-start">
      {footnotes.length ? (
        footnotes.map((footnote, index) => (
          <Button
            className={`w-full cursor-pointer rounded-md p-2 text-left outline-none transition-all duration-300 ease-in-out hover:underline ${
              activeFootnote === footnote.id ? "bg-brand2-300" : "bg-white"
            }`}
            key={index}
            onPress={() => footnoteButtonPressHandler(footnote.id)}
          >
            {footnote.lines}
          </Button>
        ))
      ) : (
        <div>This letter has no footnotes.</div>
      )}
    </div>
  );
}
