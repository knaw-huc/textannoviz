import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import {
  Artworks,
  isArtworkEntity,
  isEntity,
  isPersonEntity,
  Persons,
} from "./ProjectAnnotationModel";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  if (isEntity(props.body) && isPersonEntity(props.body.metadata.ref)) {
    return <PersonEntity person={props.body.metadata.ref} />;
  }

  if (isEntity(props.body) && isArtworkEntity(props.body.metadata.ref)) {
    return <ArtworkEntity artwork={props.body.metadata.ref} />;
  }
  return null;
};

const PersonEntity = (props: { person: Persons }) => {
  const { person } = props;
  return (
    <div>
      <p className="font-bold">{person[0].sortLabel}</p>
      <p>
        {person[0].birth.when}-{person[0].death.when}
      </p>
    </div>
  );
};

const ArtworkEntity = (props: { artwork: Artworks }) => {
  const { artwork } = props;
  return (
    <div>
      <p className="font-bold">{artwork[0].head[1].text}</p>
      <p>Date: {artwork[0].date.text}</p>
      <p>Artist: {artwork[0].relation.ref.sortLabel}</p>
      <p>
        Size: {artwork[0].measure[0].quantity} x{" "}
        {artwork[0].measure[1].quantity} {artwork[0].measure[0].unit}
      </p>
      <p>Support: {artwork[0].note[1].text}</p>
      <p>
        Collection:{" "}
        {artwork[0].note
          .filter((note) => note["tei:type"] === "collection")
          .map((note, index) => (
            <span key={index}>{note.text}</span>
          ))}
      </p>
      <p>
        Credits:{" "}
        {artwork[0].note
          .filter((note) => note["tei:type"] === "creditline")
          .map((note, index) => (
            <span key={index}>{note.text}</span>
          ))}
      </p>
    </div>
  );
};
