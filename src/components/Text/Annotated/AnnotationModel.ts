import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";

export type AnnotationType = "search" | "annotation";

/**
 * ID of annotation:
 * - annotation body id
 * - search highlight index
 */
export type AnnotationBodyId = string;
export type SearchHighlightBodyId = string;

export type SearchHighlightBody = {
  id: SearchHighlightBodyId;
};

export type AnnotationBody = AnnoRepoBody | SearchHighlightBody;

export type WithTypeAndBody<T extends AnnotationBody> = {
  type: AnnotationType;
  body: T;
};

/**
 * Annotation with char positions relative to line
 *
 * Note: end offset excludes last character, as found in the body ID,
 * but not in line with the char index as returned by broccoli (which includes the last char)
 */
export type RelativeOffsets<T extends AnnotationBody = AnnotationBody> =
  WithTypeAndBody<T> & {
    lineIndex: number;
    startChar: number;

    /**
     * Excluding last character (see note {@link RelativeOffsets})
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
  return !isSearchHighlightAnnotationOffset(toTest);
}

export function isSearchHighlightAnnotationOffset(
  toTest: AnnotationOffset,
): toTest is AnnotationOffset<SearchHighlightBody> {
  return toTest.type === "search";
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
 * Search highlight 'annotations' aren't part of nested annotations
 * but always rendered as the innermost annotation
 */
export type SearchHighlightAnnotationSegment =
  AnnotationSegmentWithBodyAndOffsets<SearchHighlightBody>;

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
  | SearchHighlightAnnotationSegment;

export function isNestedAnnotationSegment(
  toTest: AnnotationSegment,
): toTest is NestedAnnotationSegment {
  return !isSearchHighlightAnnotationSegment(toTest);
}

export function isSearchHighlightAnnotationSegment(
  toTest: AnnotationSegment,
): toTest is SearchHighlightAnnotationSegment {
  return toTest.type === "search";
}

/**
 * Segment of a line with its text and the annotations that apply
 */
export type Segment = {
  index: number;
  annotations: AnnotationSegment[];
  body: string;
};
