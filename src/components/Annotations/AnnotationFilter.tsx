import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  useTranslateProject,
  useProjectStore,
} from "../../stores/project";
import { selectDistinctBodyTypes } from "../../utils/broccoli";

export const AnnotationFilter = () => {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude,
  );
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude,
  );
  const ref = React.useRef<HTMLSelectElement>(null);
  const [annotationTypes, setAnnotationTypes] = React.useState<string[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    async function fetchAnnotationTypes() {
      const annotationTypes = await selectDistinctBodyTypes(
        projectConfig.id,
        projectConfig.broccoliUrl,
        signal,
      );
      setAnnotationTypes(annotationTypes);
    }

    if (isOpen) {
      if (annotationTypes.length === 0) {
        fetchAnnotationTypes();
      }
      ref.current?.focus();
    }

    return () => {
      controller.abort();
    };
  }, [annotationTypes.length, isOpen, projectConfig]);

  const buttonClickHandler = () => {
    if (!isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value,
    );
    setAnnotationTypesToInclude(selectedOptions);
  };

  const resetFilterClickHandler = () => {
    if (projectConfig) {
      setAnnotationTypesToInclude(projectConfig.annotationTypesToInclude);
    }
  };

  return (
    <>
      {projectConfig && (
        <div>
          <Button onClick={buttonClickHandler}>
            Filter annotations {String.fromCharCode(isOpen ? 9662 : 9656)}
          </Button>
          {isOpen && (
            <div>
              <select
                ref={ref}
                multiple
                onChange={changeHandler}
                style={{ height: "200px", width: "150px" }}
              >
                {annotationTypes.map((annType, index) => {
                  return (
                    <option
                      key={index}
                      selected={annotationTypesToInclude.includes(annType)}
                      value={annType}
                    >
                      {translateProject(annType)}
                    </option>
                  );
                })}
              </select>
              <Button onClick={resetFilterClickHandler}>Reset filter</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

function Button(props: { children?: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className="mr-2 rounded border-none bg-blue-600 px-2 py-1 text-white"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
