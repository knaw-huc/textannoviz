import React from "react";
import { Link } from "react-router-dom";
import { projectContext } from "../../state/project/ProjectContext";

export const AnnotationLinks = () => {
  const { projectState } = React.useContext(projectContext);

  return (
    <div id="annotation-links">
      <Link to="/">Home</Link>
      {projectState.config &&
        projectState.config.renderAnnotationLinks &&
        projectState.config.renderAnnotationLinks()}
    </div>
  );
};
