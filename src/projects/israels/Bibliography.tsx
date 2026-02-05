import { getViteEnvVars } from "../../utils/viteEnvVars";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Bibliography as KunstenaarsbrievenBibliography } from "../kunstenaarsbrieven/Bibliography.tsx";

const { israelsBiblENUrl, israelsBiblNLUrl } = getViteEnvVars();

export const Bibliography = () => {
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const getUrl = (lang?: string) =>
    lang === "en" ? israelsBiblENUrl : israelsBiblNLUrl;

  return (
    <KunstenaarsbrievenBibliography
      getUrl={getUrl}
      interfaceLang={interfaceLang}
    />
  );
};
