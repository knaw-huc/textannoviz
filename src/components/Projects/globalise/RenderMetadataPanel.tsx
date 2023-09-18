import { useParams } from "react-router-dom";
import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation";
import { useProjectStore } from "../../../stores/project";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  // const documentAnno = props.annotations.filter(
  //   (anno) => anno.body.type === "Document",
  // );

  const params = useParams();
  const projectConfig = useProjectStore((state) => state.projectConfig);

  const generalMissiveAnnotation = props.annotations.filter(
    (annotation) => annotation.body.type === "GeneralMissive",
  );
  const textRegionAnnotation = props.annotations.filter(
    (annotation) => annotation.body.type === "px:TextRegion",
  );
  const pageAnnotation = props.annotations.filter(
    (annotation) => annotation.body.type === "px:Page",
  );

  const gridOneColumn = "grid grid-cols-1";

  const currentAnnotation = props.annotations.filter(
    (annotation) => annotation.body.id === params.tier2,
  );

  function renderGeneralMissiveMetadata() {
    return (
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Annotation type: </strong>
          <div className={gridOneColumn}>
            {generalMissiveAnnotation[0].body.type}
          </div>
        </li>
        <li className="mb-8">
          <strong>Link to AnnoRepo: </strong>
          <a
            href={generalMissiveAnnotation[0].id}
            title="AnnoRepo link"
            rel="noreferrer"
            target="_blank"
          >
            {generalMissiveAnnotation[0].id}
          </a>
        </li>
        {Object.entries(generalMissiveAnnotation[0].body.metadata).map(
          ([key, value], i) => {
            return (
              <li key={i} className="mb-8 grid grid-cols-1">
                {`${key}: ${value}`}
              </li>
            );
          },
        )}
      </ul>
    );
  }

  function renderTextRegionMetadata() {
    return (
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <strong>Annotation type: </strong>
          <div className={gridOneColumn}>
            {textRegionAnnotation[0].body.type}
          </div>
        </li>
        <li className="mb-8">
          <strong>Link to AnnoRepo: </strong>
          <div className={gridOneColumn}>
            <a
              href={textRegionAnnotation[0].id}
              title="AnnoRepo link"
              rel="noreferrer"
              target="_blank"
            >
              {textRegionAnnotation[0].id}
            </a>
          </div>
        </li>
        {Object.entries(textRegionAnnotation[0].body.metadata).map(
          ([key, value], i) => {
            return (
              <li key={i} className="mb-8 grid grid-cols-1">
                {`${key}: ${value}`}
              </li>
            );
          },
        )}
      </ul>
    );
  }

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
      currentAnnotation[0].body.type === "GeneralMissive" &&
      generalMissiveAnnotation.length > 0
    ) {
      return renderGeneralMissiveMetadata();
    }

    if (
      currentAnnotation[0].body.type === "px:TextRegion" &&
      textRegionAnnotation.length > 0
    ) {
      return renderTextRegionMetadata();
    }

    if (
      currentAnnotation[0].body.type === "px:Page" &&
      pageAnnotation.length > 0
    ) {
      return renderPageMetadata();
    }

    return <div>No panel defined for this annotation type.</div>;
  }

  return <>{params.tier2 ? renderMetadataPanelAnnotationView() : null}</>;
};
