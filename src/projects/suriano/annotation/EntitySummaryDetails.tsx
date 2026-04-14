import { EntitySummaryDetailsProps } from "../../../model/ProjectConfig";
import {
  isPerson,
  Person,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export const EntitySummaryDetails = (props: EntitySummaryDetailsProps) => {
  if (isPerson(props.body)) {
    return <PersonEntity persons={[props.body["tei:ref"]]} />;
  }
  return null;
};

const PersonEntity = (props: { persons: Person[] }) => {
  //FIXME: this adds all persons together with only 1 search button. This happens because it's 1 annotation with multiple persons in the body(.metadata).ref. In other projects, every entity had it's own annotation.
  const { persons } = props;
  console.log(persons);
  return (
    <>
      {persons.map((pers) => (
        <div key={pers.id} className="flex flex-col gap-4">
          <div>
            <p className="italic text-gray-500">Primary Name</p>
            <p>{pers.sortLabel}</p>
          </div>
          {pers.note?.en.shortdesc && (
            <div>
              <p className="italic text-gray-500">Occupations, roles, titles</p>
              <p>{pers.note.en.shortdesc}</p>
            </div>
          )}
          {pers.birth && (
            <div>
              <p className="italic text-gray-500">Date of birth</p>
              <p>{pers.birth.when}</p>
            </div>
          )}
          {pers.death && (
            <div>
              <p className="italic text-gray-500">Date of death</p>
              <p>{pers.death.when}</p>
            </div>
          )}
          {pers.note?.en.biographic && (
            <div>
              <p className="italic text-gray-500">General notes</p>
              <p>{pers.note.en.biographic}</p>
            </div>
          )}
          {pers.note?.en.bibliography && (
            <div>
              <p className="italic text-gray-500">
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
