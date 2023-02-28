import { useProjectStore } from "../../stores/project";
export const AnnotationButtons = () => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return projectConfig && projectConfig.renderAnnotationButtons();
};
