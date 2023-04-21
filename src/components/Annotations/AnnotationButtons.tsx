import { useProjectStore } from "../../stores/project";

interface AnnotationButtonsProps {
  nextOrPrevButtonClicked: (clicked: boolean) => boolean;
}

export const AnnotationButtons = (props: AnnotationButtonsProps) => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return (
    projectConfig &&
    projectConfig.renderAnnotationButtons(props.nextOrPrevButtonClicked)
  );
};
