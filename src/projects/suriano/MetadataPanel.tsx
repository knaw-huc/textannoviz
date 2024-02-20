import {
  AnnoRepoAnnotation,
  SurianoTfFileBody,
} from "../../model/AnnoRepoAnnotation";

type MetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: MetadataPanelProps) => {
  const fileAnno = props.annotations.find(
    (anno) => anno.body.type === "tf:File",
  );

  return (
    <>
      <ul className="m-0 list-none p-0">
        {Object.entries(fileAnno?.body.metadata as SurianoTfFileBody).map(
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
