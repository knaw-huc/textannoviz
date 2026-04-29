import { TextOffsets } from "./AnnotationModel.ts";
import { createSegments } from "./utils/createSegments.ts";
import { BlockSchema, createBlocks, removeInvalidElements } from "./block";
import { useMemo } from "react";
import { LazyElements } from "./LazyElements.tsx";

type SegmentedTextProps = {
  body: string;
  offsets: TextOffsets[];
  blockSchema: BlockSchema;
};

export function SegmentedText(props: SegmentedTextProps) {
  const { body, offsets, blockSchema } = props;

  const elements = useMemo(() => {
    const segments = createSegments(body, offsets, blockSchema);
    const blocks = createBlocks(segments);
    const cleaned = removeInvalidElements(blocks, blockSchema);
    return cleaned;
  }, [body, offsets, blockSchema]);

  return <LazyElements elements={elements} totalChars={body.length} />;
}
