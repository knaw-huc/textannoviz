import { EntityDetail } from "../../../model/AnnoRepoAnnotation.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function MetadataDetailLabelValues(props: { details?: EntityDetail[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  if (!props.details?.length) {
    return null;
  }
  return (
    <div className="metadata-details mb-4 flex flex-col gap-4">
      {props.details.map((detailEntry, i) => (
        <div key={i}>
          <span
            className="block italic text-gray-500"
            style={{
              marginBottom: "-0.25em",
              marginTop: "0.25em",
            }}
          >
            {translateProject(detailEntry.label)}
          </span>
          <span
            className=""
            dangerouslySetInnerHTML={{ __html: detailEntry.value }}
          />
        </div>
      ))}
    </div>
  );
}
