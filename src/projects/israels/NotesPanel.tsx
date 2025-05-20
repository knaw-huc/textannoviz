import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const textPanels = useTextStore().views;

  if (!textPanels) return;

  const noteText = textPanels["textNotes"];

  return (
    <div role="textpanel">
      <AnnotatedText text={noteText} showDetail={false} />
    </div>
  );
};
