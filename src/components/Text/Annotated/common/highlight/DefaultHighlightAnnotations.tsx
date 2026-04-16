import {
  HighlightBody,
  isAnnotationHighlightBody,
  isSearchHighlightBody,
} from "../../utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../core";
import {
  createStartEndClasses,
  normalizeClassname,
} from "../../utils/createAnnotationClasses.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../../stores/project.ts";
import _ from "lodash";
import { TocHeader } from "./TocHeader.tsx";
import { useAnnotationStore } from "../../../../../stores/annotation.ts";

export function DefaultHighlightAnnotations(
  props: HighlightProps<HighlightBody>,
) {
  const { highlights, segment, children } = props;

  const { getHighlightCategory, showToc, getTocId } = useProjectStore(
    projectConfigSelector,
  );
  const annotations = useAnnotationStore((s) => s.annotations);
  const showTocHighlight = showToc(annotations);

  const allClasses: string[] = [];
  let tocId = "";

  for (const highlight of highlights) {
    const body = highlight.body;

    if (isSearchHighlightBody(body)) {
      allClasses.push("bg-yellow-200", "rounded");
    } else if (isAnnotationHighlightBody(body)) {
      allClasses.push(`highlight-${getHighlightCategory(body)}`);

      if (showTocHighlight && !tocId) {
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
