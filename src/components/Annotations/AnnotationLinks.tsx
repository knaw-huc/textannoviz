import { Link } from "react-router-dom";
import { useProjectStore } from "../../stores/project";

export const AnnotationLinks = () => {
  const projectConfig = useProjectStore((state) => state.projectConfig);

  return (
    <div id="annotation-links" style={{ paddingBottom: "5px" }}>
      <Link to="/">Home</Link> {"| "}
      <Link to="/search">Search</Link>
      {projectConfig &&
        projectConfig.renderAnnotationLinks &&
        projectConfig.renderAnnotationLinks()}
    </div>
  );
};
