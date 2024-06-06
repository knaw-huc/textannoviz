import _ from "lodash";
import {
  AnnotationOffset,
  OffsetsByCharIndex,
  RelativeTextAnnotation,
} from "../Model.ts";

/**
 * List all start and end offsets of annotations per character index
 *
 * Excluding last character (see note {@link RelativeTextAnnotation})
 */
export function listAnnotationOffsets(
  annotations: RelativeTextAnnotation[],
): OffsetsByCharIndex[] {
  const annotationPositions = new Map<number, AnnotationOffset[]>();
  for (const annotation of annotations) {
    const newStartOffset: AnnotationOffset = {
      charIndex: annotation.startChar,
      type: "start",
      annotationId: annotation.anno.body.id,
    };
    const offsetsAtStartChar = annotationPositions.get(annotation.startChar);
    if (offsetsAtStartChar) {
      offsetsAtStartChar.push(newStartOffset);
    } else {
      annotationPositions.set(annotation.startChar, [newStartOffset]);
    }

    const newEndOffset: AnnotationOffset = {
      charIndex: annotation.startChar,
      type: "end",
      annotationId: annotation.anno.body.id,
    };
    const offsetsAtEndChar = annotationPositions.get(annotation.endChar);
    if (offsetsAtEndChar) {
      offsetsAtEndChar.push(newEndOffset);
    } else {
      annotationPositions.set(annotation.endChar, [newEndOffset]);
    }
  }
  const annotationOffsetsByCharIndex = Array.from(
    annotationPositions.entries(),
  ).map(([charIndex, offsets]) => ({ charIndex, offsets }));
  const sortedByCharIndex = _.sortBy(
    annotationOffsetsByCharIndex,
    (e) => e.charIndex,
  );
  return sortedByCharIndex;
}
