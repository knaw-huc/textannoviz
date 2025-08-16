import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { TextComponent } from "../Text/TextComponent";
import { useInitDetail } from "./useInitDetail";

export const TextComponentTab = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { isLoadingDetail } = useInitDetail();

  return (
    <TextComponent
      panelsToRender={projectConfig.defaultTextPanels}
      allPossiblePanels={projectConfig.allPossibleTextPanels}
      isLoading={isLoadingDetail}
    />
  );
};
