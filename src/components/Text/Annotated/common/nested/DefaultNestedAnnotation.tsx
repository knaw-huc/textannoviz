import { NestedProps } from "../../core";

import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../../stores/project.ts";
import {
  createStartEndClasses,
  normalizeClassname,
  toEntityClassname,
} from "../../utils/createAnnotationClasses.ts";
import { AnnoRepoBody } from "../../../../../model/AnnoRepoAnnotation.ts";

export function DefaultNestedAnnotation(props: NestedProps<AnnoRepoBody>) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const entityTypes = projectConfig.entityAnnotationTypes;
  const { nested, segment, children } = props;

  const classes = [
    "nested-annotation",
    "cursor-pointer",
    "depth-" + nested.depth,
  ];
  if (entityTypes.includes(nested.body.type)) {
    const category = projectConfig.getAnnotationCategory(nested.body);
    classes.push(toEntityClassname(projectConfig, category));
  }
  classes.push(...createStartEndClasses(segment, nested));

  return (
    <span className={classes.map(normalizeClassname).join(" ")}>
      {children}
    </span>
  );
}
