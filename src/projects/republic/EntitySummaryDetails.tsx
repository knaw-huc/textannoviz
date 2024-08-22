import { trimMiddle } from "../../components/Text/Annotated/utils/trimMiddle.ts";
import { isRepublicEntity } from "../../model/AnnoRepoAnnotation.ts";
import { EntitySummaryDetailsProps } from "../../model/ProjectConfig.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  return (
    isRepublicEntity(props.body) && (
      <div>{trimMiddle(props.body.text, 120)}</div>
    )
  );
};
