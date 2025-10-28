import React from "react";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { AnnotationItemContent } from "./AnnotationItemContent";
import { Button } from "react-aria-components";

type AnnotationSnippetProps = {
  annotation: AnnoRepoAnnotation;
};

export function AnnotationItem(props: AnnotationSnippetProps) {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <div className="m-1 border border-solid border-gray-400 p-3">
      <Button
        onPress={() => setOpen(!isOpen)}
        className="cursor-pointer font-bold hover:underline"
      >
        <projectConfig.components.AnnotationItem
          annotation={props.annotation}
        />
      </Button>
      {isOpen && <AnnotationItemContent annotation={props.annotation} />}
    </div>
  );
}
