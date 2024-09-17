import { trimMiddle } from "../../../components/Text/Annotated/utils/trimMiddle.ts";
import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig.ts";
import { isEntity } from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  const body = props.body;
  if (isEntity(body)) {
    return <div>{trimMiddle(body.text, 120)}</div>;
  }
};
