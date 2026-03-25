import {
  isAnnotationHighlightBody,
  isSearchHighlightBody,
  HighlightBody,
} from "./utils/highlightBodyGuards.ts";
import { HighlightProps } from "../core";
import {
  createStartEndClasses,
  normalizeClassname,
} from "./utils/createAnnotationClasses.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import _ from "lodash";

export function ProjectHighlightAnnotations(
  props: HighlightProps<HighlightBody>,
) {
  const { getHighlightCategory } = useProjectStore(projectConfigSelector);
  const { highlights, segment, children } = props;

  const allClasses: string[] = [];
  for (const highlight of highlights) {
    const body = highlight.body;
    if (isSearchHighlightBody(body)) {
      allClasses.push("bg-yellow-200", "rounded");
    } else if (isAnnotationHighlightBody(body)) {
      allClasses.push(`highlight-${getHighlightCategory(body)}`);
    }
    allClasses.push(...createStartEndClasses(segment, highlight));
  }

  const classNames = _.uniq(allClasses).map(normalizeClassname);

  return <span className={classNames.join(" ")}>{children}</span>;
}
