import { ProjectAnnotatedText } from "../../components/Text/Annotated/ProjectAnnotatedText.tsx";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { useTranslateProject } from "../../stores/project";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { useKunstenaarsbrievenTextViews } from "../kunstenaarsbrieven/text/useKunstenaarsbrievenTextViews.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useKunstenaarsbrievenTextViews();
  const translateProject = useTranslateProject();

  const letterAnnoBody = findLetterBody(props.annotations);

  const { n, identifier, recipient, sender } = letterAnnoBody ?? {};

  const labelStyling = "text-neutral-500 uppercase text-sm";

  const transcrSourceText = textViews?.transcrSource?.en;
  const datingText = textViews?.dating?.en;
  const remarksText = textViews?.remarks?.en;

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
                {Array.isArray(sender) ? sender.join(", ") : sender}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("recipient")}:{" "}
                </div>
                {Array.isArray(recipient) ? recipient.join(", ") : recipient}
              </div>
            </li>
            {datingText?.body.length ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("dating")}:{" "}
                  </div>
                  <ProjectAnnotatedText text={datingText} showDetail={false} />
                </div>
              </li>
            ) : null}
            {transcrSourceText?.body.length ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("transcrSource")}:{" "}
                  </div>
                  <ProjectAnnotatedText
                    text={transcrSourceText}
                    showDetail={false}
                  />
                </div>
              </li>
            ) : null}
            {remarksText?.body.length ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("remarks")}:{" "}
                  </div>
                  <ProjectAnnotatedText text={remarksText} showDetail={false} />
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
