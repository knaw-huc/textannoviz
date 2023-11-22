import { projectConfigSelector, useProjectStore } from "../../stores/project";

interface AnnotationButtonsProps {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
}

export const AnnotationButtons = (props: AnnotationButtonsProps) => {
  const projectConfig = useProjectStore(projectConfigSelector);
  return (
    <projectConfig.components.AnnotationButtons
      nextOrPrevButtonClicked={props.nextOrPrevButtonClicked}
    />
  );
};
