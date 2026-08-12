import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Persons as KunstenaarsbrievenPersons } from "../kunstenaarsbrieven/Persons";

export function Persons() {
  const personsUrl = useProjectStore(projectConfigSelector).personsUrl;

  return <KunstenaarsbrievenPersons personsUrl={personsUrl} />;
}
