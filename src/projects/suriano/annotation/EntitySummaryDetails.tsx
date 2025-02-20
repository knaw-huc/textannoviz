import { MetadataDetailLabelValues } from "../../../components/Detail/Text/Annotated/MetadataDetailLabelValues.tsx";
import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig.ts";
import { isEntity } from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  if (!isEntity(props.body)) {
    return null;
  }
  return <MetadataDetailLabelValues details={props.body.metadata.details} />;
};
