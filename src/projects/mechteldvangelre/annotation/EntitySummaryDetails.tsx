import {
  Person,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: {
  entityBody: PersonTeiRef;
  entityCategory: string;
}) => {
  if (props.entityCategory === "PER") {
    return <PersonEntity persons={[props.entityBody as Person]} />;
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
