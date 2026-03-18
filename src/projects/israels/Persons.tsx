import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Persons as KunstenaarsbrievenPersons } from "../kunstenaarsbrieven/Persons";

export function Persons() {
  const { israelsPersonsUrl } = getViteEnvVars();

  return <KunstenaarsbrievenPersons personsUrl={israelsPersonsUrl} />;
}
