import { AnnotatedText } from "../../components/Text/Annotated/AnnotatedText";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useTextStore().views;
  const translateProject = useProjectStore(translateProjectSelector);

  const letterAnnoBody = findLetterBody(props.annotations);

  const { n, identifier, recipient, sender } = letterAnnoBody ?? {};

  const typedNotes = textViews?.["typedNotes"];
  const typedNoteText = typedNotes?.["en"];

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
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("sender")}:{" "}
                </div>
                {sender}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("recipient")}:{" "}
                </div>
                {recipient}
              </div>
            </li>
            {typedNoteText ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("addInfo")}:{" "}
                  </div>
                  <AnnotatedText text={typedNoteText} showDetail={false} />
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
