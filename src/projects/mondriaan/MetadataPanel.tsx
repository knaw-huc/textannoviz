import {
  AnnoRepoAnnotation,
  TfLetterBody,
} from "../../model/AnnoRepoAnnotation";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const letterAnno = props.annotations.filter(
    (anno) => anno.body.type === "tf:Letter",
  );

  return (
    <>
      <ul className="m-0 list-none p-0">
        {Object.entries((letterAnno[0].body as TfLetterBody).metadata).map(
          ([key, value], index) => (
            <li className="mb-8" key={index}>
              <div className="grid grid-cols-1">
                <strong>{translateProject(key)}</strong>
                {value}
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  );
};
