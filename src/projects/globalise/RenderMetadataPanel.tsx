import { useParams } from "react-router-dom";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const params = useParams();
  const pageAnnotation = props.annotations.filter(
    (annotation) => annotation.body.type === "px:Page",
  );

  const gridOneColumn = "grid grid-cols-1";

  const currentAnnotation = props.annotations.filter(
    (annotation) => annotation.body.id === params.tier2,
  );

  function renderPageMetadata() {
    return (
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Annotation type: </strong>
          <div className={gridOneColumn}>{pageAnnotation[0].body.type}</div>
        </li>
        <li className="mb-8">
          <strong>Link to AnnoRepo: </strong>
          <a
            href={pageAnnotation[0].id}
            title="AnnoRepo link"
            rel="noreferrer"
            target="_blank"
          >
            {pageAnnotation[0].id}
          </a>
        </li>
      </ul>
    );
  }

  function renderMetadataPanelAnnotationView() {
    if (
      currentAnnotation[0] &&
      currentAnnotation[0].body.type === "px:Page" &&
      pageAnnotation.length > 0
    ) {
      return renderPageMetadata();
    }

    return <div>No panel defined for this annotation type.</div>;
  }

  return <>{params.tier2 ? renderMetadataPanelAnnotationView() : null}</>;
};
