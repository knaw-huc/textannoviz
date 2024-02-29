import React from "react";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";

type AnnotationContentProps = {
  annotation: AnnoRepoAnnotation;
};

export function AnnotationItemContent(props: AnnotationContentProps) {
  const [showFull, setShowFull] = React.useState(false);
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <div>
      <ul>
        <projectConfig.components.AnnotationItemContent
          annotation={props.annotation}
        />
        <li>
          <button
            onClick={() => {
              setShowFull(!showFull);
            }}
          >
            <strong>full annotation</strong>{" "}
            {String.fromCharCode(showFull ? 9663 : 9657)}
          </button>
          <div className="overflow-auto">
            {showFull && <pre>{JSON.stringify(props.annotation, null, 2)}</pre>}
          </div>
        </li>
      </ul>
    </div>
  );
}
