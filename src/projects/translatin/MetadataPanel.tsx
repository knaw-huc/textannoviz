import {
  AnnoRepoAnnotation,
  TranslatinDramaBody,
} from "../../model/AnnoRepoAnnotation";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const dramaAnno = props.annotations.find(
    (anno) => anno.body.type === "tei:Drama",
  );

  return (
    <>
      <ul className="m-0 list-none p-0">
        {Object.entries((dramaAnno?.body as TranslatinDramaBody).metadata).map(
          ([key, value], index) => (
            <li className="mb-8" key={index}>
              <div className="grid grid-cols-1">
                <strong>{key}</strong>
                {value}
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  );
};
