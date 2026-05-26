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
  return null;
};

const PersonEntity = (props: { persons: Person[] }) => {
  const { persons } = props;
  const headerClass = "italic text-gray-500";
  return (
    <>
      {persons.map((pers) => (
        <div key={pers.id} className="flex flex-col gap-4">
          <div>
            <p className={headerClass}>Primary Name</p>
            <p>{pers.sortLabel}</p>
          </div>
          {pers.note?.en.shortdesc && (
            <div>
              <p className={headerClass}>Occupations, roles, titles</p>
              <p>{pers.note.en.shortdesc}</p>
            </div>
          )}
          {pers.birth && (
            <div>
              <p className={headerClass}>Date of birth</p>
              <p>{pers.birth.when}</p>
            </div>
          )}
          {pers.death && (
            <div>
              <p className={headerClass}>Date of death</p>
              <p>{pers.death.when}</p>
            </div>
          )}
          {pers.note?.en.biographic && (
            <div>
              <p className={headerClass}>General notes</p>
              <p>{pers.note.en.biographic}</p>
            </div>
          )}
          {pers.note?.en.bibliography && (
            <div>
              <p className={headerClass}>
                Bibliography: secondary literature and websites
              </p>
              {typeof pers.note.en.bibliography === "string" && (
                <p>{pers.note.en.bibliography}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};
