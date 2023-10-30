import { Link } from "react-router-dom";
import { useAnnotationStore } from "../../stores/annotation";
import {projectConfigSelector, useProjectStore} from "../../stores/project";

export const AnnotationLinks = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const resetOpenAnn = useAnnotationStore((state) => state.resetOpenAnn);
  const setCurrentSelectedAnn = useAnnotationStore(
    (state) => state.setCurrentSelectedAnn,
  );

  const linkClickHandler = () => {
    resetOpenAnn();
    setCurrentSelectedAnn("");
  };

  return (
    <div id="annotation-links" style={{ paddingBottom: "5px" }}>
      <Link to="/" onClick={linkClickHandler}>
        Home
      </Link>{" "}
      {"| "}
      <Link to="/search" onClick={linkClickHandler}>
        Search
      </Link>
      <projectConfig.components.AnnotationLinks/>
    </div>
  );
};
