import {ProjectConfig} from "../../model/ProjectConfig";
import {useProjectStore} from "../../stores/project";

interface AnnotationButtonsProps {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
}

export const AnnotationButtons = (props: AnnotationButtonsProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return (
    (projectConfig as ProjectConfig) &&
    (projectConfig as ProjectConfig).renderAnnotationButtons(
      props.nextOrPrevButtonClicked,
    )
  );
};
