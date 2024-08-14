import { EntityDetail } from "../../../model/AnnoRepoAnnotation.ts";

export function MetadataDetailLabelValues(props: { details?: EntityDetail[] }) {
  if (!props.details?.length) {
    return null;
  }
  return (
    <div className="metadata-details">
      {props.details.map((detailEntry, i) => (
        <div key={i}>
          <span>{detailEntry.label}</span>:&nbsp;
          <span dangerouslySetInnerHTML={{ __html: detailEntry.value }} />
        </div>
      ))}
    </div>
  );
}
