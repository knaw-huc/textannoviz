import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import { isEntity, isPersonEntity } from "./ProjectAnnotationModel";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  if (isEntity(props.body) && isPersonEntity(props.body.metadata.ref)) {
    return (
      <div>
        <p className="font-bold">{props.body.metadata.ref[0].sortLabel}</p>
        <p>
          {props.body.metadata.ref[0].birth.when}-
          {props.body.metadata.ref[0].death.when}
        </p>
      </div>
    );
  }
  return null;
};
