import React from "react";
import { Button } from "reactions-knaw-huc";
import { Broccoli } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";
import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli";

interface AnnotationFilterProps {
  loading: (bool: boolean) => void;
}

export const AnnotationFilter = (props: AnnotationFilterProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const currentContext = useMiradorStore((state) => state.currentContext);
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
    console.log(selectedOptions);

    const includeResults = ["anno"];

    fetchBroccoliScanWithOverlap(
      currentContext.bodyId,
      selectedOptions,
      includeResults,
      projectConfig
    ).then((result: Broccoli) => {
      props.loading(false);
      setAnnotations(result.anno);
    });
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
                      selected={projectConfig.annotationTypesToInclude.includes(
                        annType
                      )}
                    >
                      {annType}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      )}
    </>
  );
};
