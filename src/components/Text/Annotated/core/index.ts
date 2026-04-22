export {
  AnnotatedText,
  type AnyAnnotatedTextComponents,
} from "./AnnotatedText.tsx";

export type {
  NestedProps,
  HighlightProps,
  MarkerProps,
  GroupProps,
} from "./AnnotatedText.tsx";

export type {
  Body,
  AnnotationSegment,
  GroupedSegments,
  MarkerSegment,
  NestedSegment,
  Segment,
  TextOffsets,
} from "./AnnotationModel.ts";

export { TextSegmentsViewer } from "./inline/TextSegmentsViewer.tsx";

export type { BlockType, BlockAnnotationSegment } from "./AnnotationModel.ts";
export { isBlockAnnotationSegment } from "./AnnotationModel.ts";
export { BlockBuilder, type BlockSchema } from "./block";
export type { Element, Block, Inline } from "./block";
