import {
  Body,
  GroupedSegments,
  HighlightSegment,
  MarkerSegment,
  NestedAnnotationSegment,
  Segment,
  TextOffsets,
} from "./AnnotationModel.ts";
import { SegmentedText } from "./SegmentedText.tsx";
import { createContext, FC, PropsWithChildren, ReactNode } from "react";
import { Any } from "../../../../utils/Any.ts";

/**
 * AnnotatedText renders text segments and their annotations
 *
 * Takes a text string and a list of annotation offsets, splits the text
 * into segments, and renders them using four pluggable components:
 *
 * Terminology:
 * - Offset: start or end character index of an annotation in a text
 *   (begin includes, end excludes)
 * - Segment: piece of text uninterrupted by annotation offsets
 * - Depth: nesting level of an annotation within overlapping annotations
 * - Group: all segments connected through overlapping or nested annotations
 *   (touching annotations like <a>aa</a><b>bb</b> are separate groups)
 *
 * See also: {@link AnnotatedTextConfig}
 */
export function AnnotatedText<
  ANNOTATION extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
>(props: AnnotatedTextProps<ANNOTATION, HIGHLIGHT, MARKER>) {
  return (
    <AnnotatedTextProvider
      value={props.config as unknown as AnnotatedTextConfig}
    >
      <SegmentedText body={props.body} offsets={props.offsets} />
      {props.children}
    </AnnotatedTextProvider>
  );
}

export const AnnotatedTextContext = createContext<AnnotatedTextConfig | null>(
  null,
);

export const AnnotatedTextProvider = AnnotatedTextContext.Provider;

/**
 * Provide the components for rendering annotated text segments.
 * Core handles segmentation, nesting, and grouping
 *
 * - Annotation: each annotation gets its own nested component (entities)
 * - Highlight: single markup component (search matches, categories)
 * - Marker: zero-length position in text (footnotes, page breaks)
 * - Group: wrapper around segments connected by overlapping annotations
 */
export type AnnotatedTextConfig<
  ANNOTATION extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
> = {
  Annotation: FC<AnnotationProps<ANNOTATION>>;
  Highlight: FC<HighlightProps<HIGHLIGHT>>;
  Marker: FC<MarkerProps<MARKER>>;
  Group: FC<GroupProps>;
};

export type AnnotationProps<ANNOTATION extends Body = Body> = {
  annotation: NestedAnnotationSegment<ANNOTATION>;
  segment: Segment;
  children: ReactNode;
};

export type HighlightProps<HIGHLIGHT extends Body = Body> = {
  highlights: HighlightSegment<HIGHLIGHT>[];
  segment: Segment;
  children: ReactNode;
};

export type MarkerProps<MARKER extends Body = Body> = {
  marker: MarkerSegment<MARKER>;
  segment: Segment;
};

export type GroupProps = {
  group: GroupedSegments;
  children: ReactNode;
};

export type AnnotatedTextProps<
  ANNOTATION extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
> = PropsWithChildren<{
  config: AnnotatedTextConfig<ANNOTATION, HIGHLIGHT, MARKER>;
  body: string;
  offsets: TextOffsets[];
}>;

export type AnyAnnotatedTextConfig = AnnotatedTextConfig<Any, Any, Any>;
