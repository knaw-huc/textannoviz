import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import {
  AnnoRepoAnnotation,
  IsraelsTfLetterBody,
} from "../../model/AnnoRepoAnnotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { gridOneColumn } from "../../utils/gridOneColumn";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

// const letterNumRegex = /\d+/g;

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useTextStore().views;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;

  const letterAnno = props.annotations.find(
    (anno) => anno.body.type === "tf:Letter",
  );

  const idno = (letterAnno?.body as IsraelsTfLetterBody).metadata.file;
  const msId = (letterAnno?.body as IsraelsTfLetterBody).metadata.msId;

  const typedNotes = textViews?.["typedNotes"];
  const typedNoteText = typedNotes?.[interfaceLang];

  const labelStyling = "text-neutral-500 uppercase text-sm";

  return (
    <>
      <ul className="m-0 list-none p-0">
        {letterAnno ? (
          <>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Letter: </div>
                {idno}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Inventory number: </div>
                VGM, {msId}
              </div>
            </li>
            {typedNoteText ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>Additional information: </div>
                  <AnnotatedText
                    text={typedNoteText}
                    showDetail={false}
                    key={interfaceLang}
                  />
                </div>
              </li>
            ) : null}
          </>
        ) : (
          "No metadata"
        )}
      </ul>
    </>
  );
};
