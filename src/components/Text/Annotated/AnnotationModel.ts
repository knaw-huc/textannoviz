import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";

/**
 * Annotation types:
 * - search: search highlights
 * - annotation: entity annotations
 * - marker: footnote markers of zero length
 */
export type AnnotationType = "search" | "annotation" | "marker";

/**
 * IDs refer to:
 * - marker, note or 'ordinary' annotation body IDs
 * - search highlight index
 */
export type AnnotationBodyId = string;
export type MarkerBodyId = string;
export type FootnoteBodyId = string;
export type SearchHighlightId = string;

export type SearchHighlightBody = {
  id: SearchHighlightId;
};

export type MarkerBody = AnnoRepoBody;

export type AnnotationBody = AnnoRepoBody | SearchHighlightBody;

export type WithTypeAndBody<T extends AnnotationBody> = {
  type: AnnotationType;
  body: T;
};

/**
 * Annotation with offsets relative to line
 *
 * Note: end offset excludes last character, as found in the body ID,
 * but not in line with the char index as returned by broccoli (which includes the last char)
 */
export type LineOffsets<T extends AnnotationBody = AnnotationBody> =
  WithTypeAndBody<T> & {
    lineIndex: number;
    startChar: number;

    /**
     * Excluding last character (see note {@link LineOffsets})
     */
    endChar: number;
  };

/**
 * Single (start or end) offset
 */
export type AnnotationOffset<T extends AnnotationBody = AnnotationBody> =
  WithTypeAndBody<T> & {
    charIndex: number;
    mark: "start" | "end";
  };

export function isNestedAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is AnnotationOffset<AnnoRepoBody> {
  return toTest.type === "annotation";
}

export function isSearchHighlightAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is AnnotationOffset<SearchHighlightBody> {
  return toTest.type === "search";
}

export function isMarkerAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is AnnotationOffset<SearchHighlightBody> {
  return toTest.type === "marker";
}

export type CharIndex = number;

export type OffsetsByCharIndex = {
  charIndex: CharIndex;
  offsets: AnnotationOffset[];
};

/**
 * Group of annotations connected by nesting or overlapping annotations
 */
export type AnnotationGroup = {
  id: number;
  maxDepth: number;
};

export type WithSegmentOffsets = {
  startSegment: number;

  /**
   * Excluding last segment
   */
  endSegment: number;
};
/**
 * Segment of an annotation as found in {@link Segment}
 */
export type AnnotationSegmentWithBodyAndOffsets<
  T extends AnnotationBody = AnnotationBody,
> = WithTypeAndBody<T> & WithSegmentOffsets;

/**
 * Marker and search highlight 'annotations' aren't part of nested annotations
 * but are nested inside the 'ordinary' nested annotations
 */
export type SearchHighlightSegment =
  AnnotationSegmentWithBodyAndOffsets<SearchHighlightBody>;
export type MarkerSegment = AnnotationSegmentWithBodyAndOffsets<MarkerBody>;

/**
 * Segment of an annotation as found in {@link Segment}
 */
export type NestedAnnotationSegment =
  AnnotationSegmentWithBodyAndOffsets<AnnoRepoBody> & {
    /**
     * Depth of nesting in other annotations
     */
    depth: number;
    group: AnnotationGroup;
  };

export type AnnotationSegment =
  | NestedAnnotationSegment
  | SearchHighlightSegment
  | MarkerSegment;

export function isNestedAnnotationSegment(
  toTest: AnnotationSegment,
): toTest is NestedAnnotationSegment {
  return toTest.type === "annotation";
}

export function isSearchHighlightSegment(
  toTest: AnnotationSegment,
): toTest is SearchHighlightSegment {
  return toTest.type === "search";
}
export function isMarkerSegment(
  toTest: AnnotationSegment,
): toTest is MarkerSegment {
  return toTest.type === "marker";
}

/**
 * Segment of a line with its text and the annotations that apply
 */
export type Segment = {
  index: number;
  annotations: AnnotationSegment[];
  body: string;
};

export type GroupedSegments = {
  id?: number;
  segments: Segment[];
};
