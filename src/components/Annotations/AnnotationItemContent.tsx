import React from "react";
import styled from "styled-components";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { projectContext } from "../../state/project/ProjectContext";

type AnnotationContentProps = {
  annotation: AnnoRepoAnnotation | undefined;
};

const AnnPreview = styled.div`
  overflow: auto;
`;

export function AnnotationItemContent(props: AnnotationContentProps) {
  const [showFull, setShowFull] = React.useState(false);
  const { projectState } = React.useContext(projectContext);

  return (
    <>
      {props.annotation && (
        <div id="annotation-content">
          <ul>
            {projectState.config.renderAnnotationItemContent(props.annotation)}
            <li>
              <button
                className="show-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFull(!showFull);
                }}
              >
                full annotation {String.fromCharCode(showFull ? 9663 : 9657)}
              </button>
              <br />
              <AnnPreview id="annotation-preview">
                {showFull && (
                  <pre>{JSON.stringify(props.annotation, null, 2)}</pre>
                )}
              </AnnPreview>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
