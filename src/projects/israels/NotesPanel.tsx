import React from "react";
import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { NoteBody } from "../../model/AnnoRepoAnnotation";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const views = useTextStore((state) => state.views);
  const interfaceLang = useProjectStore(projectConfigSelector).defaultLanguage;
  const translateProject = useProjectStore(translateProjectSelector);
  const { activeFootnote } = useTextStore();
  const annos = useAnnotationStore().annotations;

  React.useEffect(() => {
    if (!activeFootnote) return;
    const element = document.getElementById(activeFootnote);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeFootnote]);

  const textNotes = views?.["textNotes"];

  const notes = textNotes?.[interfaceLang];
  if (!notes) return <div>{translateProject("NO_NOTES")}</div>;

  const noteAnnoBodyIds = Object.entries(notes).map(([, note]) => {
    return note.locations.relativeTo.bodyId;
  });

  const footnoteAnnos = annos
    .filter((anno) => {
      return noteAnnoBodyIds.includes(anno.body.id);
    })
    .map((footnoteAnno) => {
      return {
        footnoteId: (footnoteAnno.body as NoteBody).metadata["tei:id"],
        bodyId: footnoteAnno.body.id,
      };
    });

  const footnotes = Object.entries(notes).flatMap(([number, note], index) => {
    const footnoteAnno = footnoteAnnos[index];
    return {
      footnoteId: footnoteAnno.footnoteId,
      footnoteNumber: number,
      note: note,
    };
  });

  return (
    <div role="notespanel" className="flex flex-col" key={interfaceLang}>
      {footnotes.map((footnote) => (
        <div
          id={footnote.footnoteNumber}
          key={footnote.footnoteNumber}
          className={`flex flex-row p-2 ${
            activeFootnote === footnote.footnoteNumber
              ? "rounded-lg bg-[#FFCE01] transition-all duration-300"
              : "bg-white"
          }`}
        >
          <span className="mr-2 text-sm text-neutral-500">
            {footnote.footnoteNumber}.{" "}
          </span>
          <div className="text-sm">
            <AnnotatedText text={footnote.note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
