import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { ProjectAnnotatedText } from "../../components/Text/Annotated/project/ProjectAnnotatedText.tsx";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useTextStore().views;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useTranslateProject();

  const letterAnnoBody = findLetterBody(props.annotations);

  const { n, identifier } = letterAnnoBody ?? {};

  const typedNotes = textViews?.["typedNotes"];
  const typedNoteText = typedNotes?.[interfaceLang];

  const labelStyling = "text-neutral-500 uppercase text-sm";

  return (
    <>
      <ul className="m-0 list-none p-0">
        {letterAnnoBody ? (
          <>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("letter")}:{" "}
                </div>
                {n}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("invNr")}:{" "}
                </div>
                VGM, {identifier}
              </div>
            </li>
            {typedNoteText ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("addInfo")}:{" "}
                  </div>
                  <ProjectAnnotatedText
                    text={typedNoteText}
                    showDetail={false}
                    key={interfaceLang}
                  />
                </div>
              </li>
            ) : null}
          </>
        ) : (
          translateProject("NO_DATA")
        )}
      </ul>
    </>
  );
};
