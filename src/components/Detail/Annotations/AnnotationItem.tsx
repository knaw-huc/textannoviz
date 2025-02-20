import mirador from "mirador-knaw-huc-mui5";
import React from "react";
import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation.ts";
import { useInternalMiradorStore } from "../../../stores/internal-mirador.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { AnnotationItemContent } from "./AnnotationItemContent.tsx";

type AnnotationSnippetProps = {
  annotation: AnnoRepoAnnotation;
};

export function AnnotationItem(props: AnnotationSnippetProps) {
  const [isOpen, setOpen] = React.useState(false);
  const projectConfig = useProjectStore(projectConfigSelector);
  const miradorStore = useInternalMiradorStore((state) => state.miradorStore);

  /**
   * The next two functions might be performance intensive, especially for mobile users.
   * TODO: check performance of both functions
   */

  const selectAnn = () => {
    miradorStore.dispatch(
      mirador.actions.selectAnnotation(
        projectConfig.id,
        props.annotation.body.id,
      ),
    );
  };

  const deselectAnn = () => {
    miradorStore.dispatch(
      mirador.actions.deselectAnnotation(
        projectConfig.id,
        props.annotation.body.id,
      ),
    );
  };

  return (
    <div className="m-1 border border-solid border-gray-400 p-3">
      <div
        onClick={() => setOpen(!isOpen)}
        onMouseEnter={selectAnn}
        onMouseLeave={deselectAnn}
        className="cursor-pointer font-bold hover:underline"
      >
        <projectConfig.components.AnnotationItem
          annotation={props.annotation}
        />
      </div>
      {isOpen && <AnnotationItemContent annotation={props.annotation} />}
    </div>
  );
}
