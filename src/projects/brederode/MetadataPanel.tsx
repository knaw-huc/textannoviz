import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

import { LetterAnnoBody } from "./annotation/ProjectAnnotationModel";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const letterAnno = props.annotations.find(
    (anno) => anno.body.type === "Letter",
  ) as AnnoRepoAnnotation<LetterAnnoBody> | undefined;

  const gridOneColumn = "grid grid-cols-1";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (!letterAnno) {
    return null;
  }
  const letterAnnoBody = letterAnno.body;
  return (
    <>
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Date</strong>
          <div className={gridOneColumn}>
            {new Date(letterAnnoBody.datePublished).toLocaleDateString(
              "en-GB",
              dateOptions,
            )}
          </div>
        </li>
        <li className="mb-8">
          <strong>Sender</strong>
          <div className={gridOneColumn}>{letterAnnoBody.sender}</div>
        </li>
        <li className="mb-8">
          <strong>Recipient</strong>
          <div className={gridOneColumn}>{letterAnnoBody.recipient}</div>
        </li>
        <li className="mb-8">
          <strong>Sender location</strong>
          <div className={gridOneColumn}>{letterAnnoBody.fromLocation}</div>
        </li>
        <li className="mb-8">
          <strong>Recipient location</strong>
          <div className={gridOneColumn}>{letterAnnoBody.toLocation}</div>
        </li>
        <li className="mb-8">
          <strong>Shelfmark</strong>
          <div className={gridOneColumn}>{letterAnnoBody.shelfmark}</div>
        </li>
        <li className="mb-8">
          <strong>Link to EMLO</strong>
          <div className={gridOneColumn}>
            <a href={letterAnnoBody.url} rel="noreferrer" target="_blank">
              {letterAnnoBody.url}
            </a>
          </div>
        </li>
      </ul>
    </>
  );
};
