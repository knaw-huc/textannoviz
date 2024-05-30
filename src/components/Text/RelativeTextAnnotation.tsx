import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";

export type AnnotationType = string;

/**
 * Annotation with char positions relative to line
 */
export type RelativeTextAnnotation = {
  type: AnnotationType;
  lineIndex: number;
  startChar: number;

  /**
   * Including last character
   */
  endChar: number;

  anno: AnnoRepoAnnotation;
};
