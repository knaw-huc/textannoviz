import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
} from "../../model/AnnoRepoAnnotation.ts";
import { useTranslateProject } from "../../stores/project.ts";
import { gridOneColumn } from "../../utils/gridOneColumn.ts";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

type UnitBody = AnnoRepoBodyBase & {
  n: string;
  title: string;
};

const unit = "Unit";

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const translateProject = useTranslateProject();

  const unitAnnoBody = findUnitBody(props.annotations);

  const { n, title } = unitAnnoBody ?? {};

  const labelStyling = "text-neutral-500 uppercase text-sm";

  return (
    <>
      <ul className="m-0 list-none p-0">
        {unitAnnoBody ? (
          <>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>vergaderstuk:</div>
                {n}
              </div>
            </li>
            <li className="mb-8">
              <div className={gridOneColumn}>
                <div className={labelStyling}>titel:</div>
                {title}
              </div>
            </li>
          </>
        ) : (
          translateProject("NO_DATA")
        )}
      </ul>
    </>
  );
};

function findUnitBody(annotations: AnnoRepoAnnotation[]): UnitBody | undefined {
  const found = annotations.find((anno) => anno.body.type === unit);
  if (isUnitBody(found?.body)) {
    return found.body;
  }
}

function isUnitBody(toTest?: AnnoRepoBodyBase): toTest is UnitBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === unit;
}
