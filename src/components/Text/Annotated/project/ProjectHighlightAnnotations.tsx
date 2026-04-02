import {
  HighlightBody,
  isAnnotationHighlightBody,
  isSearchHighlightBody,
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
import { TocHeader } from "./TocHeader.tsx";

export function ProjectHighlightAnnotations(
  props: HighlightProps<HighlightBody>,
) {
  const { getHighlightCategory, showToc, getTocId } = useProjectStore(
    projectConfigSelector,
  );
  const { highlights, segment, children } = props;

  const allClasses: string[] = [];
  let tocId = "";

  for (const highlight of highlights) {
    const body = highlight.body;

    if (isSearchHighlightBody(body)) {
      allClasses.push("bg-yellow-200", "rounded");
    } else if (isAnnotationHighlightBody(body)) {
      allClasses.push(`highlight-${getHighlightCategory(body)}`);

      if (showToc && !tocId) {
        tocId = getTocId(body) ?? "";
      }
    }
    allClasses.push(...createStartEndClasses(segment, highlight));
  }

  const classNames = _.uniq(allClasses).map(normalizeClassname);

  if (tocId) {
    return (
      <TocHeader id={tocId} className={classNames.join(" ")}>
        {children}
      </TocHeader>
    );
  }

  return <span className={classNames.join(" ")}>{children}</span>;
}
