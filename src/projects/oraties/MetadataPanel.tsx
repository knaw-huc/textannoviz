import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

import { DocumentAnnoBody } from "./annotation/ProjectAnnotationModel";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const documentAnno = props.annotations.find(
    (anno) => anno.body.type === "Document",
  ) as AnnoRepoAnnotation<DocumentAnnoBody> | undefined;

  const gridOneColumn = "grid grid-cols-1";
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (!documentAnno) {
    return null;
  }
  const documentAnnoBody = documentAnno.body;
  return (
    <>
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Titel</strong>
          <div className={gridOneColumn}>{documentAnnoBody.title}</div>
        </li>
        <li className="mb-8">
          <strong>Auteur</strong>
          <div className={gridOneColumn}>{documentAnnoBody.author}</div>
        </li>
        <li className="mb-8">
          <strong>Datum</strong>
          <div className={gridOneColumn}>
            {new Date(documentAnnoBody.datePublished).toLocaleDateString(
              "nl",
              dateOptions,
            )}
          </div>
        </li>
        <li className="mb-8">
          <strong>Uitgever</strong>
          <div className={gridOneColumn}>{documentAnnoBody.publisher}</div>
        </li>
        <li className="mb-8">
          <strong>Plaats</strong>
          <div className={gridOneColumn}>{documentAnnoBody.location}</div>
        </li>
      </ul>
    </>
  );
};
