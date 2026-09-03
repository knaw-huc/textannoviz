import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { Bibliography as KunstenaarsbrievenBibliography } from "../kunstenaarsbrieven/Bibliography.tsx";

export const Bibliography = () => {
  const biblUrl = useProjectStore(projectConfigSelector).biblUrl.nl;

  if (!biblUrl) return null;

  return <KunstenaarsbrievenBibliography getUrl={() => biblUrl} />;
};
