import { trimMiddle } from "../../../components/Text/Annotated/utils/trimMiddle.ts";
import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig.ts";
import { isDateEntity, isEntity } from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  const body = props.body;
  if (isEntity(body)) {
    if (isDateEntity(body)) {
      return (
        <div>
          {body.text} ({body.metadata.date})
        </div>
      );
    } else {
      return <div>{trimMiddle(body.text, 120)}</div>;
    }
  }
};
