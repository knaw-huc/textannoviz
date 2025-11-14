import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

import { LetterAnno } from "./annotation/ProjectAnnotationModel";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const letterAnno = props.annotations.find(
    (anno) => anno.body.type === "Letter",
  );

  const gridOneColumn = "grid grid-cols-1";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return (
    <>
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Date</strong>
          <div className={gridOneColumn}>
            {new Date(
              (letterAnno?.body as LetterAnno).datePublished,
            ).toLocaleDateString("en-GB", dateOptions)}
          </div>
        </li>
        <li className="mb-8">
          <strong>Sender</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).sender}
          </div>
        </li>
        <li className="mb-8">
          <strong>Recipient</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).recipient}
          </div>
        </li>
        <li className="mb-8">
          <strong>Sender location</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).fromLocation}
          </div>
        </li>
        <li className="mb-8">
          <strong>Recipient location</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).toLocation}
          </div>
        </li>
        <li className="mb-8">
          <strong>Shelfmark</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).shelfmark}
          </div>
        </li>
        <li className="mb-8">
          <strong>Link to EMLO</strong>
          <div className={gridOneColumn}>
            <a
              href={(letterAnno?.body as LetterAnno).url}
              rel="noreferrer"
              target="_blank"
            >
              {(letterAnno?.body as LetterAnno).url}
            </a>
          </div>
        </li>
      </ul>
    </>
  );
};
