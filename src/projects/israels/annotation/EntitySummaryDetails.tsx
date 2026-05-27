import {
  Artwork,
  Person,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: {
  entityBody: PersonTeiRef | Artwork;
  entityCategory: string;
}) => {
  if (props.entityCategory === "PER") {
    return <PersonEntity persons={[props.entityBody as Person]} />;
  }

  if (props.entityCategory === "ART") {
    return <ArtworkEntity artworks={[props.entityBody as Artwork]} />;
  }
  return null;
};

const PersonEntity = (props: { persons: Person[] }) => {
  const { persons } = props;
  return (
    <>
      {persons.map((pers) => (
        <div key={pers.id}>
          <p className="font-bold">{pers.sortLabel}</p>
          <p>
            {pers.birth?.when}-{pers.death && pers.death.when}
          </p>
        </div>
      ))}
    </>
  );
};

const ArtworkEntity = (props: { artworks: Artwork[] }) => {
  const { artworks } = props;

  return (
    <>
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="flex items-start justify-between gap-4"
        ></div>
      ))}
    </>
  );
};
