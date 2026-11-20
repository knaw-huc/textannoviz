import {
  Person,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";
import type { MechteldLocation } from "./ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: {
  entityBody: PersonTeiRef;
  entityCategory: string;
}) => {
  if (props.entityCategory === "PER") {
    return <PersonEntity persons={[props.entityBody as Person]} />;
  }
  if (props.entityCategory === "LOC") {
    return (
      <LocationEntity
        location={props.entityBody as unknown as MechteldLocation}
      />
    );
  }
  return null;
};

const PersonEntity = (props: { persons: Person[] }) => {
  //FIXME: this adds all persons together with only 1 search button. This happens because it's 1 annotation with multiple persons in the body(.metadata).ref. In other projects, every entity had it's own annotation.
  const { persons } = props;
  return (
    <>
      {persons.map((pers, i) => (
        <div key={i}>
          <p className="font-bold">{pers.sortLabel}</p>
          <p>
            {pers.birth?.when}-{pers.death && pers.death.when}
          </p>
        </div>
      ))}
    </>
  );
};

const LocationEntity = (props: { location: MechteldLocation }) => {
  const name = toLocationName(props.location);
  if (!name) {
    return null;
  }
  return <p className="font-bold">{name}</p>;
};

function toLocationName(loc: MechteldLocation): string | undefined {
  // Buildings also have an optional `settlement`, so check `objectName` first.
  if ("objectName" in loc && loc.objectName) {
    return loc.objectName;
  }
  if ("settlement" in loc && loc.settlement) {
    return loc.settlement;
  }
  if ("geogName" in loc && loc.geogName) {
    return loc.geogName;
  }
  if ("region" in loc && loc.region?.length) {
    return loc.region.join(", ");
  }
  return undefined;
}
