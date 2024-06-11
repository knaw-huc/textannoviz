import _ from "lodash";
import {
  AnnotationOffset,
  OffsetsByCharIndex,
  RelativeOffsets,
} from "../Model.ts";

/**
 * List all start and end offsets of annotations per character index
 *
 * Excluding last character (see note {@link AnnotationOffsets})
 */
export function listOffsetsByChar(
  annotations: RelativeOffsets[],
): OffsetsByCharIndex[] {
  const annotationPositions = new Map<number, AnnotationOffset[]>();
  for (const annotation of annotations) {
    const newStartOffset: AnnotationOffset = {
      charIndex: annotation.startChar,
      mark: "start",
      annotationId: annotation.id,
      annotationType: annotation.type,
    };
    const offsetsAtStartChar = annotationPositions.get(annotation.startChar);
    if (offsetsAtStartChar) {
      offsetsAtStartChar.push(newStartOffset);
    } else {
      annotationPositions.set(annotation.startChar, [newStartOffset]);
    }

    const newEndOffset: AnnotationOffset = {
      charIndex: annotation.endChar,
      mark: "end",
      annotationId: annotation.id,
      annotationType: annotation.type,
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
