import React from "react";
import { Link } from "react-router-dom";
import { useProjectStore } from "../../stores/project";

export const AnnotationLinks = () => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return (
    <div id="annotation-links">
      <Link to="/">Home</Link>
      {projectConfig &&
        projectConfig.renderAnnotationLinks &&
        projectConfig.renderAnnotationLinks()}
    </div>
  );
};
