import { AnnotationProps } from "../core";

import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import type { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import {
  createStartEndClasses,
  normalizeClassname,
  toEntityClassname,
} from "../utils/createAnnotationClasses.ts";

export function DefaultNestedAnnotation(props: AnnotationProps<AnnoRepoBody>) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const entityTypes = projectConfig.entityAnnotationTypes;
  const { annotation, segment, children } = props;

  const classes = [
    "nested-annotation",
    "cursor-pointer",
    "depth-" + annotation.depth,
  ];
  if (entityTypes.includes(annotation.body.type)) {
    const category = projectConfig.getAnnotationCategory(annotation.body);
    classes.push(toEntityClassname(projectConfig, category));
  }
  classes.push(...createStartEndClasses(segment, annotation));

  return (
    <span className={classes.map(normalizeClassname).join(" ")}>
      {children}
    </span>
  );
}
