import { ProjectAnnotatedText } from "../../components/Text/Annotated/ProjectAnnotatedText.tsx";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli.ts";
import { useTranslateProject } from "../../stores/project";
import { gridOneColumn } from "../../utils/gridOneColumn";
import {
  findArticleBody,
  findLetterBody,
  LetterBody,
} from "../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import { useKunstenaarsbrievenTextViews } from "../kunstenaarsbrieven/text/useKunstenaarsbrievenTextViews.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

const labelStyling = "text-neutral-500 uppercase text-sm";

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const translateProject = useTranslateProject();

  const letterAnnoBody = findLetterBody(props.annotations);
  const articleAnnoBody = findArticleBody(props.annotations);

  if (!letterAnnoBody && !articleAnnoBody) {
    return <>{translateProject("NO_DATA")}</>;
  }

  return (
    <ul className="m-0 list-none p-0">
      {letterAnnoBody && <LetterMetadata letterAnnoBody={letterAnnoBody} />}
      {articleAnnoBody && <ArticleMetadata />}
    </ul>
  );
};

function LetterMetadata(props: { letterAnnoBody: LetterBody }) {
  const translateProject = useTranslateProject();
  const textViews = useKunstenaarsbrievenTextViews();

  const transcrSourceText = textViews?.transcrSource?.en;
  const datingText = textViews?.dating?.en;
  const remarksText = textViews?.remarks?.en;
  const pubhistory = textViews?.pubhistory?.en;

  const {
    altIdentifier,
    identifier,
    recipient,
    sender,
    place,
    institution,
    collection,
  } = props.letterAnnoBody;

  return (
    <>
      {altIdentifier && (
        <li className="mb-8">
          <div className={gridOneColumn}>
            <div className={labelStyling}>{translateProject("letter")}: </div>
            {altIdentifier}
          </div>
        </li>
      )}
      <li className="mb-8">
        <div className={gridOneColumn}>
          <div className={labelStyling}>{translateProject("invNr")}: </div>
          {[place, institution, collection, identifier]
            .filter(Boolean)
            .join(", ")}
        </div>
      </li>
      <li className="mb-8">
        <div className={gridOneColumn}>
          <div className={labelStyling}>{translateProject("sender")}: </div>
          {Array.isArray(sender) ? sender.join(", ") : sender}
        </div>
      </li>
      <li className="mb-8">
        <div className={gridOneColumn}>
          <div className={labelStyling}>{translateProject("recipient")}: </div>
          {Array.isArray(recipient) ? recipient.join(", ") : recipient}
        </div>
      </li>
      <MetadataTextItem label="dating" text={datingText} />
      <MetadataTextItem label="transcrSource" text={transcrSourceText} />
      <MetadataTextItem label="remarks" text={remarksText} />
      <MetadataTextItem label="pubhistory" text={pubhistory} />
    </>
  );
}

function ArticleMetadata() {
  const textViews = useKunstenaarsbrievenTextViews();

  const transcrSourceText = textViews?.transcrSource?.en;
  const remarksText = textViews?.remarks?.en;

  return (
    <>
      <MetadataTextItem label="transcrSource" text={transcrSourceText} />
      <MetadataTextItem label="remarks" text={remarksText} />
    </>
  );
}

function MetadataTextItem({
  label,
  text,
}: {
  label: string;
  text?: BroccoliTextGeneric;
}) {
  const translateProject = useTranslateProject();
  if (!text?.body.length) return null;
  return (
    <li className="mb-8">
      <div className={gridOneColumn}>
        <div className={labelStyling}>{translateProject(label)}: </div>
        <ProjectAnnotatedText text={text} showDetail={false} />
      </div>
    </li>
  );
}
