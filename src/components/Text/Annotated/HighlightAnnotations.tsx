import _ from "lodash";
import React, { useRef } from "react";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { isHighlightSegment } from "./AnnotationModel.ts";
import { MarkerAnnotation } from "./MarkerAnnotation.tsx";
import { NestedAnnotationProps } from "./NestedAnnotation.tsx";
import { createHighlightClasses } from "./utils/createAnnotationClasses.ts";

export function HighlightAnnotations(
  props: Pick<NestedAnnotationProps, "segment">,
) {
  const { getHighlightCategory } = useProjectStore(projectConfigSelector);
  const classNames: string[] = [];
  const highlights = props.segment.annotations.filter(isHighlightSegment);

  const ref = useRef<HTMLSpanElement>(null);

  const searchHighlightRefs = useRef(
    new Map<string, HTMLSpanElement>(),
  ).current;

  React.useEffect(() => {
    if (ref.current?.className.includes("bg-yellow-200")) {
      searchHighlightRefs.set(_.uniqueId(), ref.current);
    }
  }, []);

  React.useEffect(() => {
    const firstSearchHighlightRef = Array.from(searchHighlightRefs.values())[0];
    if (firstSearchHighlightRef) {
      firstSearchHighlightRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [searchHighlightRefs]);

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
