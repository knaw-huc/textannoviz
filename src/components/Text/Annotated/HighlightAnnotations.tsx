import { createHighlightClasses } from "./utils/createAnnotationClasses.ts";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { isHighlightSegment } from "./AnnotationModel.ts";
import { MarkerAnnotation } from "./MarkerAnnotation.tsx";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import _ from "lodash";
import { useEffect, useRef } from "react";
import { useTextStore } from "../../../stores/text.ts";
import { isStartingSegment } from "./utils/isStartingSegment.ts";

export function HighlightAnnotations(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const ref = useRef<HTMLSpanElement>(null);
  const { highlightedSearchId } = useTextStore();
  const { getHighlightCategory } = useProjectStore(projectConfigSelector);
  const classNames: string[] = [];
  const highlights = props.segment.annotations.filter(isHighlightSegment);

  useEffect(() => {
    const isStartOfSelectedHighlight = highlights.find(
      (highlight) =>
        highlight.body.id === highlightedSearchId &&
        isStartingSegment(props.segment, highlight),
    );
    if (!isStartOfSelectedHighlight) {
      return;
    }
    ref.current?.scrollIntoView();
  }, [highlightedSearchId]);

  if (!highlights.length) {
    return <MarkerAnnotation segment={props.segment} />;
  }
  const allHighlightsClasses = [];
  for (const highlight of highlights) {
    // TODO: should every highlight have its own component?
    allHighlightsClasses.push(
      ...createHighlightClasses(highlight, props.segment, getHighlightCategory),
    );
  }
  classNames.push(..._.uniq(allHighlightsClasses));

  return (
    <span ref={ref} className={classNames.join(" ")}>
      <MarkerAnnotation segment={props.segment} />
    </span>
  );
}
