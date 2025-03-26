import { useAnnotationStore } from "../../stores/annotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";

export const MetadataTab = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { annotations } = useAnnotationStore();

  return (
    <div className="text-brand1-800 h-full p-5">
      {annotations.length > 0 ? (
        <projectConfig.components.MetadataPanel annotations={annotations} />
      ) : null}
    </div>
  );
};
