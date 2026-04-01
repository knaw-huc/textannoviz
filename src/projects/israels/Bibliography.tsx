import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { Bibliography as KunstenaarsbrievenBibliography } from "../kunstenaarsbrieven/Bibliography.tsx";

export const Bibliography = () => {
  const interfaceLang = useProjectStore(projectConfigSelector).selectedLanguage;
  const biblENUrl = useProjectStore(projectConfigSelector).biblUrl.en;
  const biblNLUrl = useProjectStore(projectConfigSelector).biblUrl.nl;

  if (!biblENUrl || !biblNLUrl) return null;

  const getUrl = (lang?: string) => (lang === "en" ? biblENUrl : biblNLUrl);

  return (
    <KunstenaarsbrievenBibliography
      getUrl={getUrl}
      interfaceLang={interfaceLang}
    />
  );
};
