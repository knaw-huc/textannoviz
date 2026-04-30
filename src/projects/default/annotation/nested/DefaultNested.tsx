import { NestedProps } from "../../../../components/Text/Annotated/core";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import {
  createStartEndClasses,
  normalizeClassname,
  toEntityClassname,
} from "../../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";

export function DefaultNested(props: NestedProps<AnnoRepoBody>) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { nested, segment, children } = props;

  const classes = [
    "nested-annotation",
    "cursor-pointer",
    "depth-" + nested.depth,
  ];
  if (projectConfig.isEntity(nested.body)) {
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
