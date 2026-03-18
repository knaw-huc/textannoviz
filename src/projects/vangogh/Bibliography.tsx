import { getViteEnvVars } from "../../utils/viteEnvVars";
import { Bibliography as KunstenaarsbrievenBibliography } from "../kunstenaarsbrieven/Bibliography.tsx";

const { vanGoghBiblUrl } = getViteEnvVars();

export const Bibliography = () => {
  return <KunstenaarsbrievenBibliography getUrl={() => vanGoghBiblUrl} />;
};
