import { ProjectAnnotatedText } from "../../components/Text/Annotated/project/ProjectAnnotatedText";
import { useTranslateProject } from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useTextStore().views;
  const translateProject = useTranslateProject();

  const letterAnnoBody = findLetterBody(props.annotations);

  const {
    // n,
    dateSent,
    recipient,
    fromLocation,
    sender,
    toLocation,
    shelfmark,
  } = letterAnnoBody ?? {};

  const typedNotes = textViews?.["typedNotes"];
  const typedNoteText = typedNotes?.["en"];

  const labelStyling = "text-neutral-500 uppercase text-sm";
  // console.log("typedNoteText", typedNoteText);

  return (
    <>
      <ul className="m-0 list-none p-0">
        {letterAnnoBody ? (
          <>
            {typedNoteText ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("addInfo")}:{" "}
                  </div>
                  <ProjectAnnotatedText
                    text={typedNoteText}
                    showDetail={false}
                  />
                </div>
              </li>
            ) : null}
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("dateSent")}:{" "}
                </div>
                {dateSent}
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
                  {translateProject("fromLocation")}:{" "}
                </div>
                {fromLocation}
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
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("toLocation")}:{" "}
                </div>
                {toLocation}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("shelfmark")}:{" "}
                </div>
                {shelfmark}
              </div>
            </li>
            {/*<li className="mb-8">*/}
            {/*  <div className={gridOneColumn}>*/}
            {/*    <div className={labelStyling}>*/}
            {/*      {translateProject("letter")}:{" "}*/}
            {/*    </div>*/}
            {/*    {n}*/}
            {/*  </div>*/}
            {/*</li>*/}
          </>
        ) : (
          translateProject("NO_DATA")
        )}
      </ul>
    </>
  );
};
