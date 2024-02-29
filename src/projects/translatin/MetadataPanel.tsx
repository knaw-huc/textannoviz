import {
  AnnoRepoAnnotation,
  TfLetterBody,
} from "../../model/AnnoRepoAnnotation";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const manifestationAnno = props.annotations.find(
    (anno) => anno.body.type === "tl:Manifestation",
  );

  return (
    <>
      <ul className="m-0 list-none p-0">
        {Object.entries(manifestationAnno?.body.metadata as TfLetterBody).map(
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
