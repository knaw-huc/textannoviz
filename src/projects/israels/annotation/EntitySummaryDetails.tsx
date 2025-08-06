import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import {
  projectConfigSelector,
  translateProjectSelector,
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
    return <PersonEntity persons={props.body.metadata.ref} />;
  }

  if (isEntity(props.body) && isArtworkEntity(props.body.metadata.ref)) {
    return <ArtworkEntity artworks={props.body.metadata.ref} />;
  }
  return null;
};

const PersonEntity = (props: { persons: Persons }) => {
  //FIXME: this adds all persons together with only 1 search button. This happens because it's 1 annotation with multiple persons in the body.metadata.ref. In other projects, every entity had it's own annotation.
  const { persons } = props;
  return (
    <>
      {persons.map((pers) => (
        <div key={pers.id}>
          <p className="font-bold">{pers.sortLabel}</p>
          <p>
            {pers.birth.when}-{pers.death && pers.death.when}
          </p>
        </div>
      ))}
    </>
  );
};

const ArtworkEntity = (props: { artworks: Artworks }) => {
  const { artworks } = props;
  const interfaceLang = useProjectStore(projectConfigSelector).defaultLanguage;
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <>
      {artworks.map((artwork) => (
        <div key={artwork.id} className="flex">
          <div className="flex flex-col justify-start">
            <p className="font-bold">{artwork.head[interfaceLang]}</p>
            <p>
              {translateProject("date")}: {artwork.date.text}
            </p>
            {artwork.relation ? (
              <p>
                {translateProject("artist")}: {artwork.relation.ref.sortLabel}
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
          <div className="flex grow justify-end pb-4">
            <img src={`${artwork.graphic.url}/full/200,/0/default.jpg`} />
          </div>
        </div>
      ))}
    </>
  );
};
