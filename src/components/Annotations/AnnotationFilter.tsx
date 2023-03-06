import React from "react";
import { useParams } from "react-router-dom";
import { BroccoliV3 } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { fetchBroccoliScan } from "../../utils/fetchBroccoli";

interface AnnotationFilterProps {
  loading: (bool: boolean) => void;
}

export const AnnotationFilter = (props: AnnotationFilterProps) => {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const setAnnotations = useAnnotationStore((state) => state.setAnnotations);
  const params = useParams();

  const buttonClickHandler = () => {
    if (!isOpen) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const changeHandler = (event: any) => {
    props.loading(true);
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option: any) => option.value
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
          <button onClick={buttonClickHandler}>Filter annotations</button>
          {isOpen && (
            <div>
              <select
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
