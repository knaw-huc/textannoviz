import {
  AnnotationOffset,
  OffsetsByCharIndex,
  LineOffsets,
} from "../AnnotationModel.ts";
import sortBy from "lodash/sortBy";

/**
 * List all start and end offsets of annotations per character index
 *
 * Excluding last character (see note {@link AnnotationOffsets})
 */
export function listOffsetsByChar(
  offsets: LineOffsets[],
): OffsetsByCharIndex[] {
  const annotationPositions = new Map<number, AnnotationOffset[]>();
  for (const offset of offsets) {
    const newStartOffset: AnnotationOffset = {
      charIndex: offset.startChar,
      mark: "start",
      type: offset.type,
      body: offset.body,
    };
    const offsetsAtStartChar = annotationPositions.get(offset.startChar);
    if (offsetsAtStartChar) {
      offsetsAtStartChar.push(newStartOffset);
    } else {
      annotationPositions.set(offset.startChar, [newStartOffset]);
    }

    const newEndOffset: AnnotationOffset = {
      charIndex: offset.endChar,
      mark: "end",
      type: offset.type,
      body: offset.body,
    };
    const offsetsAtEndChar = annotationPositions.get(offset.endChar);
    if (offsetsAtEndChar) {
      offsetsAtEndChar.push(newEndOffset);
    } else {
      annotationPositions.set(offset.endChar, [newEndOffset]);
    }
  }
  const offsetsByCharIndex = Array.from(annotationPositions.entries()).map(
    ([charIndex, offsets]) => ({ charIndex, offsets }),
  );
  const sortedByCharIndex = sortBy(offsetsByCharIndex, (e) => e.charIndex);
  return sortedByCharIndex;
}
