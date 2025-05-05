import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { useTextStore } from "../../stores/text";

export const NotesPanel = () => {
  const textPanels = useTextStore().views;

  const noteText = textPanels!["textNotes"];
  console.log(noteText);

  return (
    <div role="textpanel">
      <AnnotatedText text={noteText} showDetail={false} />
    </div>
  );
};
