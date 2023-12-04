import React from "react";
import { useParams } from "react-router-dom";
import { Broccoli, BroccoliBodyIdResult } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import {
  fetchBroccoliBodyIdOfScan,
  fetchBroccoliScanWithOverlap,
  selectDistinctBodyTypes,
} from "../../utils/broccoli";

export const AnnotationsToHighlightFilter = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const ref = React.useRef<HTMLSelectElement>(null);
  const [annotationTypes, setAnnotationTypes] = React.useState<string[]>([]);
  const params = useParams();

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

  React.useEffect(() => {
    async function fetchData() {
      if (params.tier0 && params.tier1) {
        fetchBroccoliBodyIdOfScan(
          params.tier0,
          params.tier1,
          projectConfig,
        ).then((result: BroccoliBodyIdResult) => {
          const bodyId = result.bodyId;
          const includeResults = ["anno"];

          const views = projectConfig.allPossibleTextPanels.toString();

          const overlapTypes = projectConfig.annotationTypesToHighlight;
          const relativeTo = projectConfig.relativeTo;

          if (overlapTypes.length > 0) {
            fetchBroccoliScanWithOverlap(
              bodyId,
              overlapTypes,
              includeResults,
              views,
              relativeTo,
              projectConfig,
            ).then((broccoli: Broccoli) => {
              console.log(broccoli.anno);
            });
          }
        });
      }
    }

    fetchData();
  }, [params.tier0, params.tier1]);

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    console.log(selectedOptions);
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
                selected={projectConfig.annotationTypesToInclude.includes(
                  annType,
                )}
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
