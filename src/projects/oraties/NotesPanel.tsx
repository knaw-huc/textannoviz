import React from "react";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { NotesPanel as KunstenaarsbrievenNotesPanel } from "../kunstenaarsbrieven/NotesPanel";
import { Annotated } from "../../components/Text/Annotated/Annotated.tsx";
/**
 * Duplicated from {@link KunstenaarsbrievenNotesPanel}
 * // TODO: Collect reusable project components in projects/common
 **/
export const NotesPanel = () => {
  const views = useTextStore((state) => state.views);
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

  const notes = textNotes?.[interfaceLang];
  if (!notes) return <div>{translateProject("NO_NOTES")}</div>;

  return (
    //TODO 23102025: Use one of the pre-defined ARIA roles
    //eslint-disable-next-line jsx-a11y/aria-role
    <div role="notespanel" className="flex flex-col" key={interfaceLang}>
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
            <Annotated text={note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
