import {
  HighlightBody,
  isAnnotationHighlightBody,
  isEntityHighlightBody,
  isSearchHighlightBody,
} from "../../../../components/Text/Annotated/utils/highlightBodyGuards.ts";
import { HighlightProps } from "../../../../components/Text/Annotated/core";
import {
  createStartEndClasses,
  normalizeClassname,
} from "../../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import _ from "lodash";
import { TocHeader } from "./TocHeader.tsx";
import { useAnnotationStore } from "../../../../stores/annotation.ts";

export function DefaultHighlight(props: HighlightProps<HighlightBody>) {
  const { highlights, segment, children } = props;

  const { getHighlightCategory, showToc, getTocId } = useProjectStore(
    projectConfigSelector,
  );
  const annotations = useAnnotationStore((s) => s.annotations);
  const showTocHighlight = showToc(annotations);

  const allClasses: string[] = [];
  let tocId = "";
  let entityHighlightId = "";

  for (const highlight of highlights) {
    const body = highlight.body;

    if (isSearchHighlightBody(body)) {
      allClasses.push("bg-yellow-200", "rounded");
    } else if (isAnnotationHighlightBody(body)) {
      allClasses.push(`highlight-${getHighlightCategory(body)}`);

      if (showTocHighlight && !tocId) {
        tocId = getTocId(body) ?? "";
      }
    } else if (isEntityHighlightBody(body)) {
      allClasses.push("entity-highlight");
      if (highlight.startSegment === segment.index) {
        entityHighlightId = body.bodyId;
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

  if (entityHighlightId) {
    return (
      <span className={classNames.join(" ")} id={entityHighlightId}>
        {children}
      </span>
    );
  }

  return <span className={classNames.join(" ")}>{children}</span>;
}
