import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { selectDistinctBodyTypes } from "../../utils/broccoli";

export const AnnotationsToHighlightFilter = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const ref = React.useRef<HTMLSelectElement>(null);
  const [annotationTypes, setAnnotationTypes] = React.useState<string[]>([]);
  const setAnnotationTypesToHighlight = useAnnotationStore(
    (state) => state.setAnnotationTypesToHighlight,
  );
  const annotationTypesToHighlight = useAnnotationStore(
    (state) => state.annotationTypesToHighlight,
  );

  React.useEffect(() => {
    async function fetchAnnotationTypes() {
      const annotationTypes = await selectDistinctBodyTypes(
        projectConfig.id,
        projectConfig.broccoliUrl,
      );
      setAnnotationTypes(annotationTypes);
    }

    if (annotationTypes.length === 0) {
      fetchAnnotationTypes();
    }
    ref.current?.focus();
  }, []);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    console.log(selectedOptions);
    setAnnotationTypesToHighlight(selectedOptions);
  };

  return (
    <>
      <div>
        <p className="font-bold">Annotations to highlight</p>
        <select
          ref={ref}
          multiple
          onChange={changeHandler}
          style={{ height: "250px", width: "150px", border: "1px solid black" }}
        >
          {annotationTypes.map((annType, index) => {
            return (
              <option
                key={index}
                selected={annotationTypesToHighlight.includes(annType)}
                value={annType}
              >
                {translateProject(annType)}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
