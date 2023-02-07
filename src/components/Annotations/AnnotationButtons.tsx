import React from "react";
import { projectContext } from "../../state/project/ProjectContext";
export const AnnotationButtons = () => {
  const { projectState } = React.useContext(projectContext);

  return projectState.config && projectState.config.renderAnnotationButtons();
};
