import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project";
import { Artwork, isArtwork, isPerson, Person } from "./ProjectAnnotationModel";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  if (isPerson(props.body)) {
    return <PersonEntity persons={[props.body["tei:ref"]]} />;
  }

  if (isArtwork(props.body)) {
    return <ArtworkEntity artworks={[props.body["tei:ref"]]} />;
  }
  return null;
};

const PersonEntity = (props: { persons: Person[] }) => {
  //FIXME: this adds all persons together with only 1 search button. This happens because it's 1 annotation with multiple persons in the body(.metadata).ref. In other projects, every entity had it's own annotation.
  const { persons } = props;
  return (
    <>
      {persons.map((pers) => (
        <div key={pers.id}>
          <p className="font-bold">{pers.sortLabel}</p>
          <p>
            {pers.birth && pers.birth.when}-{pers.death && pers.death.when}
          </p>
        </div>
      ))}
    </>
  );
};

const ArtworkEntity = (props: { artworks: Artwork[] }) => {
  const { artworks } = props;
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const translateProject = useProjectStore(translateProjectSelector);

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
