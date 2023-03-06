import React from "react";
import { useParams } from "react-router-dom";
import { BroccoliV3 } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { fetchBroccoliScan } from "../../utils/fetchBroccoli";
import { Button } from "../Button";

interface AnnotationFilterProps {
  loading: (bool: boolean) => void;
}

export const AnnotationFilter = (props: AnnotationFilterProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const params = useParams();
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

    fetchBroccoliScan(
      params.tier0,
      params.tier1,
      projectConfig,
      selectedOptions
    ).then(function (result: BroccoliV3) {
      props.loading(false);
      setAnnotations(result.anno);
    });
  };

  return (
    <>
      {projectConfig && (
        <div>
          <Button onClick={buttonClickHandler}>Filter annotations</Button>
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
