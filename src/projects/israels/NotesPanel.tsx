import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const textPanels = useTextStore().views;

  if (!textPanels) return;

  const dutchNotes = textPanels["textNotes"]["nl"];
  const englishNotes = textPanels["textNotes"]["en"];

  return (
    <div role="notespanel">
      {Object.entries(dutchNotes)
        .map(([footNoteNumber, dutchNote], index) => {
          const englishNote = englishNotes[footNoteNumber];
          return [
            <div key={`dutch-${index}`} className="flex flex-row">
              <span className="mr-4 text-sm text-neutral-500">
                {footNoteNumber}.{" "}
              </span>
              <div className="mb-4 text-sm">
                <AnnotatedText text={dutchNote} showDetail={false} />
              </div>
            </div>,
            englishNote && (
              <div key={`english-${index}`} className="flex flex-row">
                <span className="mr-4 text-sm text-neutral-500">
                  {footNoteNumber}.{" "}
                </span>
                <div className="mb-4 text-sm">
                  <AnnotatedText text={englishNote} showDetail={false} />
                </div>
              </div>
            ),
          ];
        })
        .flat()}
    </div>
  );
};
