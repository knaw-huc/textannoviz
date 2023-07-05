import {
  AnnoRepoAnnotation,
  TfLetterBody,
} from "../../../model/AnnoRepoAnnotation";
import { useProjectStore } from "../../../stores/project";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const letterAnno = props.annotations.filter(
    (anno) => anno.body.type === "tf:Letter"
  );

  console.log(letterAnno);

  return (
    <>
      <ul className="metadataPanelUl">
        {Object.entries((letterAnno[0].body as TfLetterBody).metadata).map(
          ([key, value], index) => (
            <li className="metadataPanelLi" key={index}>
              <div className="metadataPanelLiContent">
                <strong>
                  {projectConfig &&
                    projectConfig.metadataPanelTitles &&
                    projectConfig.metadataPanelTitles[key]}
                </strong>
                {value}
              </div>
            </li>
          )
        )}
      </ul>
    </>
  );
};
