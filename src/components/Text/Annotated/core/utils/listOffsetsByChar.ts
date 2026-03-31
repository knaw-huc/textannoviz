import _ from "lodash";
import {
  AnnotationOffset,
  OffsetsByCharIndex,
  TextOffsets,
} from "../AnnotationModel.ts";

/**
 * List all start and end offsets of annotations per character index
 *
 * Excluding last character (see note {@link TextOffsets})
 */
export function listOffsetsByChar(
  offsets: TextOffsets[],
): OffsetsByCharIndex[] {
  const annotationPositions = new Map<number, AnnotationOffset[]>();
  for (const offset of offsets) {
    const newStartOffset: AnnotationOffset = {
      charIndex: offset.beginChar,
      mark: "start",
      type: offset.type,
      body: offset.body,
    };
    const offsetsAtStartChar = annotationPositions.get(offset.beginChar);
    if (offsetsAtStartChar) {
      offsetsAtStartChar.push(newStartOffset);
    } else {
      annotationPositions.set(offset.beginChar, [newStartOffset]);
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
  const sortedByCharIndex = _.sortBy(offsetsByCharIndex, (e) => e.charIndex);
  return sortedByCharIndex;
}
