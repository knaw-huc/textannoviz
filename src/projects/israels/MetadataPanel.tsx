import {
  AnnoRepoAnnotation,
  IsraelsTfLetterBody,
} from "../../model/AnnoRepoAnnotation";
import { gridOneColumn } from "../../utils/gridOneColumn";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

// const letterNumRegex = /\d+/g;

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const letterAnno = props.annotations.find(
    (anno) => anno.body.type === "tf:Letter",
  );

  const idno = (letterAnno?.body as IsraelsTfLetterBody).metadata.file;
  const msId = (letterAnno?.body as IsraelsTfLetterBody).metadata.msId;

  // const letterNum = idno.match(letterNumRegex)?.[0];

  const labelStyling = "text-neutral-500 uppercase text-sm";

  return (
    <>
      <ul className="m-0 list-none p-0">
        {letterAnno ? (
          <>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Letter: </div>
                {idno}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>Inventory number: </div>
                VGM, {msId}
              </div>
            </li>
          </>
        ) : (
          "No metadata"
        )}
      </ul>
    </>
  );
};
