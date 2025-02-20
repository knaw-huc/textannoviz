import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project";
import { BrowseScanButtons } from "../Footer/BrowseScanButtons";

export const AnnotationButtons = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  return (
    <>
      <projectConfig.components.AnnotationButtons />
      {projectConfig.showPrevNextScanButtons ? <BrowseScanButtons /> : null}
    </>
  );
};
