import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const textPanels = useTextStore().views;

  if (!textPanels) return;

  const dutchNotes = textPanels["textNotes"]?.["nl"];
  const englishNotes = textPanels["textNotes"]?.["en"];

  if (!dutchNotes || !englishNotes)
    return <div>This letter contains no notes.</div>;

  return (
    <div role="notespanel" className="flex flex-col">
      <div className="mb-2 font-bold">Dutch notes</div>
      {Object.entries(dutchNotes).map(
        ([dutchFootnoteNumber, dutchNote], index) => (
          <div key={index} className="flex flex-row">
            <span className="mr-4 text-sm text-neutral-500">
              {dutchFootnoteNumber}.{" "}
            </span>
            <div className="mb-4 text-sm">
              <AnnotatedText text={dutchNote} showDetail={false} />
            </div>
          </div>
        ),
      )}
      <div className="mb-2 font-bold">English notes</div>
      {Object.entries(englishNotes).map(
        ([englishFootnoteNumber, englishNote], index) => (
          <div key={index} className="flex flex-row">
            <span className="mr-4 text-sm text-neutral-500">
              {englishFootnoteNumber}.{" "}
            </span>
            <div className="mb-4 text-sm">
              <AnnotatedText text={englishNote} showDetail={false} />
            </div>
          </div>
        ),
      )}
    </div>
  );
};
