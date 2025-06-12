import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const views = useTextStore((state) => state.views);
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useProjectStore(translateProjectSelector);

  const textNotes = views?.["textNotes"];
  const notes = textNotes?.[interfaceLang];

  if (!notes) return <div>{translateProject("NO_NOTES")}</div>;

  return (
    <div role="notespanel" className="flex flex-col" key={interfaceLang}>
      {Object.entries(notes).map(([footnoteNumber, note]) => (
        <div key={footnoteNumber} className="flex flex-row">
          <span className="mr-4 text-sm text-neutral-500">
            {footnoteNumber}.{" "}
          </span>
          <div className="mb-4 text-sm">
            <AnnotatedText text={note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
