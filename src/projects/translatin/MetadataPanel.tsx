import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { findDocumentBody } from "./annotation/ProjectAnnotationModel";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const documentAnnoBody = findDocumentBody(props.annotations);

  const labelStyling = "text-neutral-500 uppercase text-sm";

  return (
    <>
      <ul className="m-0 list-none p-0">
        {documentAnnoBody ? (
          <>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Author</div>
                {documentAnnoBody.author}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Title</div>
                {documentAnnoBody.title}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Publisher</div>
                {documentAnnoBody.location}, {documentAnnoBody.publisher}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Date published</div>
                {documentAnnoBody.datePublished}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>First edition</div>
                {documentAnnoBody.firstEdition}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Genre</div>
                {documentAnnoBody.genre}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Edited by</div>
                {documentAnnoBody.editor}
              </div>
            </li>
          </>
        ) : (
          "No metadata."
        )}
      </ul>
    </>
  );
};
