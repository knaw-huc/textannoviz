import { ProjectAnnotatedText } from "../../components/Text/Annotated/ProjectAnnotatedText.tsx";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { useTranslateProject } from "../../stores/project.ts";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";
import { gridOneColumn } from "../../utils/gridOneColumn.ts";
import { findMechteldLetterBody } from "./annotation/ProjectAnnotationModel.ts";
import { useMechteldVanGelreTextViews } from "./text/useMechteldVanGelreTextViews.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const textViews = useMechteldVanGelreTextViews();
  const translateProject = useTranslateProject();

  const letterAnnoBody = findMechteldLetterBody(props.annotations);

  const {
    n,
    identifier,
    recipient,
    sender,
    place,
    institution,
    collection,
    material,
    watermark,
    measure,
    seal,
  } = letterAnnoBody ?? {};

  const labelStyling = "text-neutral-500 uppercase text-sm";

  const publication = textViews?.publication?.nl;
  const seclit = textViews?.seclit?.nl;

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
                {[place, institution, collection, identifier]
                  .filter(Boolean)
                  .join(", ")}
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
            {publication?.body.length ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("publication")}:{" "}
                  </div>
                  <ProjectAnnotatedText text={publication} showDetail={false} />
                </div>
              </li>
            ) : null}
            {seclit?.body.length ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("seclit")}:{" "}
                  </div>
                  <ProjectAnnotatedText text={seclit} showDetail={false} />
                </div>
              </li>
            ) : null}
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>
                  {translateProject("material")}:{" "}
                </div>
                {material && firstLetterToUppercase(material)}
              </div>
            </li>
            {watermark ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("watermark")}:{" "}
                  </div>
                  {watermark}
                </div>
              </li>
            ) : null}
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>{translateProject("size")}: </div>
                {/* .[1] = vertical; .[0] = horizontal. It's always in 'mm'. */}
                {`${measure?.[1]} x ${measure?.[0]} mm`}
              </div>
            </li>
            {seal ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <div className={labelStyling}>
                    {translateProject("seal")}:{" "}
                  </div>
                  {seal}
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
