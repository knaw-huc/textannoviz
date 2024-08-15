import { EntityDetail } from "../../../model/AnnoRepoAnnotation.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function MetadataDetailLabelValues(props: { details?: EntityDetail[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  console.log("MetadataDetailLabelValues", props.details);
  if (!props.details?.length) {
    return null;
  }
  return (
    <div className="metadata-details">
      {props.details.map((detailEntry, i) => (
        <div key={i}>
          <span
            className="block text-xs italic text-gray-500"
            style={{
              marginBottom: "-0.25em",
              marginTop: "0.25em",
            }}
          >
            {translateProject(detailEntry.label)}
          </span>
          <span
            className="text-xs"
            dangerouslySetInnerHTML={{ __html: detailEntry.value }}
          />
        </div>
      ))}
    </div>
  );
}
