import React from "react";
import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";

export const NotesPanel = () => {
  const views = useTextStore((state) => state.views);
  const interfaceLang = useProjectStore((s) => s.interfaceLanguage);
  const translateProject = useProjectStore(translateProjectSelector);
  const { activeFootnote } = useTextStore();

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
            <AnnotatedText text={note} showDetail={false} />
          </div>
        </div>
      ))}
    </div>
  );
};
