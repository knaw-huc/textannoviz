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
import { HIT_ANCHORS_ATTRIBUTE } from "../../../../components/Text/Annotated/utils/hitAnchors.ts";

export function DefaultHighlight(props: HighlightProps<HighlightBody>) {
  const { highlights, segment, children } = props;

  const { getHighlightCategory, showToc, getTocId } = useProjectStore(
    projectConfigSelector,
  );
  const annotations = useAnnotationStore((s) => s.annotations);
  const showTocHighlight = showToc(annotations);

  const allClasses: string[] = [];
  let tocId = "";
  // Hits starting in this segment, so the reveal can scroll to them
  const hitAnchors: string[] = [];

  for (const highlight of highlights) {
    const body = highlight.body;
    const isStart = highlight.startSegment === segment.index;

    if (isSearchHighlightBody(body)) {
      allClasses.push("bg-yellow-200", "rounded");
      if (isStart) {
        hitAnchors.push(body.anchor);
      }
    } else if (isAnnotationHighlightBody(body)) {
      allClasses.push(`highlight-${getHighlightCategory(body)}`);

      if (showTocHighlight && !tocId) {
        tocId = getTocId(body) ?? "";
      }
    } else if (isEntityHighlightBody(body)) {
      allClasses.push("entity-highlight");
      if (isStart) {
        hitAnchors.push(body.bodyId);
      }
    }
    allClasses.push(...createStartEndClasses(segment, highlight));
  }

  const classNames = _.uniq(allClasses).map(normalizeClassname);
  const anchorProps = hitAnchors.length
    ? { [HIT_ANCHORS_ATTRIBUTE]: hitAnchors.join(" ") }
    : {};

  if (tocId) {
    return (
      <TocHeader id={tocId} className={classNames.join(" ")} {...anchorProps}>
        {children}
      </TocHeader>
    );
  }

  return (
    <span className={classNames.join(" ")} {...anchorProps}>
      {children}
    </span>
  );
}
