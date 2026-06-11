import React from "react";
import { ProjectAnnotatedText } from "../../components/Text/Annotated/ProjectAnnotatedText.tsx";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { useKunstenaarsbrievenTextViews } from "./text/useKunstenaarsbrievenTextViews.ts";

export const NotesPanel = () => {
  const views = useKunstenaarsbrievenTextViews();
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useTranslateProject();
  const activeFootnote = useTextStore((state) => state.activeFootnote);

  React.useEffect(() => {
    if (!activeFootnote) return;
    const element = document.getElementById(activeFootnote);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeFootnote]);

  const textNotes = views?.["textNotes"];
  const ogtNotesText = views?.ogtNotes?.en;

  const notes = textNotes?.[interfaceLang];
  if (!notes) return <div>{translateProject("NO_NOTES")}</div>;

  return (
    //TODO 23102025: Use one of the pre-defined ARIA roles
    //eslint-disable-next-line jsx-a11y/aria-role
    <div role="notespanel" className="flex flex-col" key={interfaceLang}>
      {ogtNotesText?.body && (
        <div className="mb-4 text-sm">
          <div className="text-sm uppercase text-neutral-500">
            {translateProject("ogtNotes")}
          </div>
          {<ProjectAnnotatedText text={ogtNotesText} showDetail={false} />}
        </div>
      )}

      {Object.entries(notes).map(([footnoteNumber, note]) => (
        <div
          id={footnoteNumber}
          key={footnoteNumber}
          className={`flex flex-row p-2 ${
            activeFootnote === footnoteNumber
              ? "rounded-lg bg-[#FFCE01] transition-all duration-300"
              : "bg-white"
          }`}
        >
          <span className="mr-2 text-sm text-neutral-500">
            {footnoteNumber}.{" "}
          </span>
          <div className="text-sm">
            <ProjectAnnotatedText text={note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
