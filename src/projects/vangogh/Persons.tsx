import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Persons as KunstenaarsbrievenPersons } from "../kunstenaarsbrieven/Persons";

export function Persons() {
  const { vanGoghPersonsUrl } = getViteEnvVars();

  return <KunstenaarsbrievenPersons personsUrl={vanGoghPersonsUrl} />;
}
