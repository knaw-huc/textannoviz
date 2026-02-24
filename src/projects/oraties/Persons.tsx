import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Persons as KunstenaarsbrievenPersons } from "../kunstenaarsbrieven/Persons";

export function Persons() {
  const { oratiesPersonsUrl } = getViteEnvVars();

  return <KunstenaarsbrievenPersons personsUrl={oratiesPersonsUrl} />;
}
