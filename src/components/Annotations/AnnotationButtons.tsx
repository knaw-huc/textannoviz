import { projectConfigSelector, useProjectStore } from "../../stores/project";

export const AnnotationButtons = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  return (
    <>
      <projectConfig.components.AnnotationButtons />
      <projectConfig.components.BrowseScanButtons />
    </>
  );
};
