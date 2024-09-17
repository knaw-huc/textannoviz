import { MetadataDetailLabelValues } from "../../../components/Text/Annotated/MetadataDetailLabelValues.tsx";
import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig.ts";
import { isEntity } from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  return (
    isEntity(props.body) && (
      <MetadataDetailLabelValues details={props.body.metadata.details} />
    )
  );
};
