import {
  AnnoRepoAnnotation,
  TfLetterBody,
} from "../../model/AnnoRepoAnnotation";
import { useProjectStore } from "../../stores/project";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);
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
                <strong>
                  {projectConfig &&
                    projectConfig.metadataPanelTitles &&
                    projectConfig.metadataPanelTitles[key]}
                </strong>
                {value}
              </div>
            </li>
          ),
        )}
      </ul>
    </>
  );
};
