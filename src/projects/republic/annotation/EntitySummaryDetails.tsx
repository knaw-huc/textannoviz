import { trimMiddle } from "../../../components/Text/Annotated/utils/trimMiddle.ts";
import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig.ts";
import {
  isDateEntity,
  isEntity,
  DateEntityBody,
} from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  const body = props.body;
  if (isDateEntity(body)) {
    return <DateEntity body={body} />;
  }
  if (isEntity(body)) {
    return <div>{trimMiddle(body.text, 120)}</div>;
  }
  return null;
};

function DateEntity(props: { body: DateEntityBody }) {
  return (
    <div>
      {props.body.text} ({props.body.metadata.date})
    </div>
  );
}
