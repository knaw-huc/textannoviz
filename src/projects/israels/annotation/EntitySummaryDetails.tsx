import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project";
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
  const interfaceLang = useProjectStore(projectConfigSelector).defaultLanguage;

  return (
    <div>
      <p className="font-bold">{artwork[0].head[interfaceLang]}</p>
      <p>Date: {artwork[0].date.text}</p>
      <p>Artist: {artwork[0].relation.ref.sortLabel}</p>
      <p>
        Size: {artwork[0].measure[0].quantity} x{" "}
        {artwork[0].measure[1].quantity} {artwork[0].measure[0].unit}
      </p>
      <p>
        Support:{" "}
        {Object.entries(artwork[0].note[interfaceLang])
          .filter(([key]) => key === "technical")
          .map(([, value], index) => (
            <span key={index}>{value}</span>
          ))}
      </p>
      <p>
        Collection:{" "}
        {Object.entries(artwork[0].note[interfaceLang])
          .filter(([key]) => key === "collection")
          .map(([, value], index) => (
            <span key={index}>{value}</span>
          ))}
      </p>
      <p>
        Credits:{" "}
        {Object.entries(artwork[0].note[interfaceLang])
          .filter(([key]) => key === "creditline")
          .map(([, value], index) => (
            <span key={index}>{value}</span>
          ))}
      </p>
    </div>
  );
};
