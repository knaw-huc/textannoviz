import React from "react";
import { Button } from "reactions-knaw-huc";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";

interface AnnotationFilterProps {
  loading: (bool: boolean) => void;
}

export const AnnotationFilter = (props: AnnotationFilterProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const setAnnotationTypesToInclude = useAnnotationStore(
    (state) => state.setAnnotationTypesToInclude
  );
  const annotationTypesToInclude = useAnnotationStore(
    (state) => state.annotationTypesToInclude
  );
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      ref.current.focus();
    }
  }, [isOpen]);

  const buttonClickHandler = () => {
    if (!isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    props.loading(true);
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    setAnnotationTypesToInclude(selectedOptions);
  };

  const resetFilterClickHandler = () => {
    setAnnotationTypesToInclude(projectConfig.annotationTypesToInclude);
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
                {projectConfig.annotationTypes.map((annType, index) => {
                  return (
                    <option
                      key={index}
                      selected={annotationTypesToInclude.includes(annType)}
                    >
                      {annType}
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
