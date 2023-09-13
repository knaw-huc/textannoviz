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

  const gridOneColumn = "grid grid-cols-1";

  function renderGeneralMissiveMetadata() {
    return (
      <ul className="m-0 list-none p-0">
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

  function renderMetadataPanelAnnotationView() {
    if (
      params.tier2?.includes("missive") &&
      generalMissiveAnnotation.length > 0
    ) {
      return renderGeneralMissiveMetadata();
    }

    if (
      params.tier2?.includes("textregion") &&
      textRegionAnnotation.length > 0
    ) {
      return renderTextRegionMetadata();
    }

    return <div>No panel defined for this annotation type.</div>;
  }

  return (
    <>
      {params.tier2 ? renderMetadataPanelAnnotationView() : null}
      {/* <strong>Document: </strong>
          {(documentAnno[0].body as DocumentBody).metadata.document} */}
    </>
  );
};
