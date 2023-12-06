import { Select, SelectItem, Selection } from "@nextui-org/react";
import React from "react";
import { useAnnotationStore } from "../../stores/annotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

export const AnnotationsToHighlightFilter = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const setAnnotationTypesToHighlight = useAnnotationStore(
    (state) => state.setAnnotationTypesToHighlight,
  );
  const annotationTypesToHighlight = useAnnotationStore(
    (state) => state.annotationTypesToHighlight,
  );
  const [selectedValues, setSelectedValues] = React.useState<Selection>(
    new Set(annotationTypesToHighlight),
  );

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValues(new Set(event.target.value.split(",")));

    const newAnnotationTypesToHighlight = Array.from(
      event.target.value.split(","),
    );
    setAnnotationTypesToHighlight(newAnnotationTypesToHighlight);
  };

  return (
    <>
      <div className="flex w-full flex-row items-center gap-6">
        <p className="font-bold">Annotation types to highlight in text</p>
        <Select
          aria-label="Annotation types to highlight in text"
          placeholder="Select annotation types to highlight in text"
          selectionMode="multiple"
          isMultiline={true}
          onChange={changeHandler}
          selectedKeys={selectedValues}
          className="max-w-[250px]"
        >
          {projectConfig.allowedAnnotationTypesToHighlight.map((annType) => (
            <SelectItem key={annType} value={annType}>
              {translateProject(annType)}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
};
