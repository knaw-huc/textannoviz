import {
  AnnoRepoAnnotation,
  DocumentBody,
} from "../../../model/AnnoRepoAnnotation";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const documentAnno = props.annotations.filter(
    (anno) => anno.body.type === "Document",
  );

  return (
    <ul className="m-0 list-none p-0">
      <li className="mb-8">
        <div className="grid grid-cols-1">
          <strong>Document: </strong>
          {(documentAnno[0].body as DocumentBody).metadata.document}
        </div>
      </li>
    </ul>
  );
};
