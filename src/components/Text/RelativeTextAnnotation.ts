import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";

export type AnnotationType = string;
export type AnnotationBodyId = string;

/**
 * Annotation with char positions relative to line
 *
 * Note: end offset excludes last character, as found in the body ID,
 * but not in line with the char index as returned by broccoli (which includes the last char)
 */
export type RelativeTextAnnotation = {
  type: AnnotationType;
  lineIndex: number;

  startChar: number;

  /**
   * Excluding last character (see note {@link RelativeTextAnnotation})
   */
  endChar: number;

  anno: AnnoRepoAnnotation;
};
