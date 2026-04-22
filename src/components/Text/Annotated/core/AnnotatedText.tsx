import {
  BlockAnnotationSegment,
  Body,
  GroupedSegments,
  HighlightSegment,
  MarkerSegment,
  NestedSegment,
  Segment,
  TextOffsets,
} from "./AnnotationModel.ts";
import { SegmentedText } from "./SegmentedText.tsx";
import { createContext, FC, PropsWithChildren, ReactNode } from "react";
import { Any } from "../../../../utils/Any.ts";
import { BlockSchema } from "./block";

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
 * See also: {@link AnnotatedTextComponents}
 */
export function AnnotatedText<
  NESTED extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
  BLOCK extends Body = Body,
>(props: AnnotatedTextProps<NESTED, HIGHLIGHT, MARKER, BLOCK>) {
  return (
    <AnnotatedTextProvider
      value={props.components as unknown as AnnotatedTextComponents}
    >
      <SegmentedText
        body={props.text}
        offsets={props.offsets}
        blockSchema={props.blockSchema}
      />
      {props.children}
    </AnnotatedTextProvider>
  );
}

export const AnnotatedTextContext =
  createContext<AnnotatedTextComponents | null>(null);

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
export type AnnotatedTextComponents<
  NESTED extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
  BLOCK extends Body = Body,
> = {
  Nested: FC<NestedProps<NESTED>>;
  Highlight: FC<HighlightProps<HIGHLIGHT>>;
  Marker: FC<MarkerProps<MARKER>>;
  Group: FC<GroupProps>;
  Block: FC<BlockProps<BLOCK>>;
};

export type NestedProps<ANNOTATION extends Body = Body> = {
  nested: NestedSegment<ANNOTATION>;
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

export type BlockProps<BLOCK extends Body = Body> = {
  block: BlockAnnotationSegment<BLOCK>;
  children: ReactNode;
};

export type AnnotatedTextProps<
  ANNOTATION extends Body = Body,
  HIGHLIGHT extends Body = Body,
  MARKER extends Body = Body,
  BLOCK extends Body = Body,
> = PropsWithChildren<{
  components: AnnotatedTextComponents<ANNOTATION, HIGHLIGHT, MARKER, BLOCK>;
  text: string;
  offsets: TextOffsets[];
  blockSchema: BlockSchema;
}>;

export type AnyAnnotatedTextComponents = AnnotatedTextComponents<Any, Any, Any>;
