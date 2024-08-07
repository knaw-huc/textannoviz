import { RepublicEntityBody } from "../../model/AnnoRepoAnnotation";

export function EntityMetadata(props: { body: RepublicEntityBody }) {
  console.log(props.body);
  return (
    <div>
      <div className="font-bold">
        Label:{" "}
        <span className="font-normal">
          {props.body.metadata.entityLabels.join(",")}
        </span>
      </div>
      <div className="font-bold">
        Name: <span className="font-normal">{props.body.metadata.name}</span>
      </div>
    </div>
  );
}
