import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { useTranslateProject } from "../../stores/project";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findLetterBody } from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const translateProject = useTranslateProject();

  const letterAnnoBody = findLetterBody(props.annotations);

  const { n, identifier, recipient, sender } = letterAnnoBody ?? {};

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
          </>
        ) : (
          translateProject("NO_DATA")
        )}
      </ul>
    </>
  );
};
