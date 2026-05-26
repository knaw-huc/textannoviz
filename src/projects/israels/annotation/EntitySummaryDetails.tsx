import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../../stores/project";
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
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useTranslateProject();

  return (
    <>
      {artworks.map((artwork) => (
        <div
          key={artwork.id}
          className="flex items-start justify-between gap-4"
        >
          <div className="flex max-w-[500px] flex-col justify-start">
            <p className="font-bold">{artwork.head[interfaceLang]}</p>
            <p>
              {translateProject("date")}: {artwork.date.text}
            </p>
            {artwork.relation ? (
              <p>
                {translateProject("artist")}: {artwork.relation.ref?.sortLabel}
              </p>
            ) : null}
            {artwork.measure ? (
              <p>
                {translateProject("size")}: {artwork.measure[0].quantity} x{" "}
                {artwork.measure[1].quantity} {artwork.measure[0].unit}
              </p>
            ) : null}
            <p>
              {translateProject("support")}:{" "}
              {Object.entries(artwork.note[interfaceLang])
                .filter(([key]) => key === "technical")
                .map(([, value], index) => (
                  <span key={index}>{value}</span>
                ))}
            </p>
            <p>
              {translateProject("collection")}:{" "}
              {Object.entries(artwork.note[interfaceLang])
                .filter(([key]) => key === "collection")
                .map(([, value], index) => (
                  <span key={index}>{value}</span>
                ))}
            </p>
            <p>
              {translateProject("credits")}:{" "}
              {Object.entries(artwork.note[interfaceLang])
                .filter(([key]) => key === "creditline")
                .map(([, value], index) => (
                  <span key={index}>{value}</span>
                ))}
            </p>
          </div>
          <div className="flex items-start justify-end">
            <img
              src={`${artwork.graphic.url}/full/200,/0/default.jpg`}
              alt={artwork.head[interfaceLang]}
              className="h-auto w-[200px] object-contain"
            />
          </div>
        </div>
      ))}
    </>
  );
};
