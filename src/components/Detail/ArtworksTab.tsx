import { useAnnotationStore } from "../../stores/annotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";

export const ArtworksTab = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { annotations } = useAnnotationStore();

  return (
    <div className="text-brand1-800 h-full p-5">
      <projectConfig.components.ArtworksTab annotations={annotations} />
    </div>
  );
};
