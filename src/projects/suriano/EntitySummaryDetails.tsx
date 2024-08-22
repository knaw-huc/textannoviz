import { isSurianoEntity } from "../../model/AnnoRepoAnnotation.ts";
import { MetadataDetailLabelValues } from "../../components/Text/Annotated/MetadataDetailLabelValues.tsx";
import { EntitySummaryDetailsProps } from "../../model/ProjectConfig.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  return (
    isSurianoEntity(props.body) && (
      <MetadataDetailLabelValues details={props.body.metadata.details} />
    )
  );
};
