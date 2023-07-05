import {
  AnnoRepoAnnotation,
  DocumentBody,
} from "../../../model/AnnoRepoAnnotation";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const documentAnno = props.annotations.filter(
    (anno) => anno.body.type === "Document"
  );

  return (
    <ul className="metadataPanelUl">
      <li className="metadataPanelLi">
        <div className="metadataPanelLiContent">
          <strong>Document: </strong>
          {(documentAnno[0].body as DocumentBody).metadata.document}
        </div>
      </li>
    </ul>
  );
};
