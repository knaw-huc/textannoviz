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
  GrouplessAnnotationSegment,
  AnnotationSegment,
  NestedSegment,
  Segment,
  GroupedSegments,
  MarkerSegment,
  GrouplessNestedSegment,
  GrouplessSegment,
  TextOffsets,
} from "./AnnotationModel.ts";

export {
  isBlockAnnotationSegment,
  isNestedSegment,
} from "./AnnotationModel.ts";

export { TextSegmentsViewer } from "./inline/TextSegmentsViewer.tsx";

export type { BlockType, BlockAnnotationSegment } from "./AnnotationModel.ts";
export { BlockBuilder, type BlockSchema } from "./block";
export type { Element, Block, Inline } from "./block";
export { assignGroupToSegments } from "./utils/assignGroupToSegments.ts";
