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
          <strong>Datum</strong>
          <div className={gridOneColumn}>
            {new Date(
              (letterAnno?.body as LetterAnno).dateSent,
            ).toLocaleDateString("en-GB", dateOptions)}
          </div>
        </li>
        <li className="mb-8">
          <strong>Afzender</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).sender}
          </div>
        </li>
        <li className="mb-8">
          <strong>Ontvanger</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).recipient}
          </div>
        </li>
        <li className="mb-8">
          <strong>Plaats</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).fromLocation}
          </div>
        </li>
        <li className="mb-8">
          <strong>Editeur</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).editor}
          </div>
        </li>
        <li className="mb-8">
          <strong>Uitgever</strong>
          <div className={gridOneColumn}>
            {(letterAnno?.body as LetterAnno).publisher}
          </div>
        </li>
      </ul>
    </>
  );
};
