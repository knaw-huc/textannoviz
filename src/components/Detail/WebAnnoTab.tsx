import { useAnnotationStore } from "../../stores/annotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { AnnotationFilter } from "../Annotations/AnnotationFilter";
import { AnnotationItem } from "../Annotations/AnnotationItem";

export const WebAnnoTab = () => {
  const { annotations } = useAnnotationStore();
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <>
      {projectConfig.showWebAnnoTab ? (
        <>
          <div className="flex">
            <AnnotationFilter />
          </div>
          {annotations?.length > 0 &&
            annotations.map((annotation, index) => (
              <AnnotationItem key={index} annotation={annotation} />
            ))}
          {annotations?.length === 0 && (
            <div className="font-bold">No web annotations</div>
          )}
        </>
      ) : null}
    </>
  );
};
