import { useEffect, useState } from "react";
import { TextOffsets } from "./AnnotationModel.ts";
import { SegmentGroup } from "./inline/SegmentGroup.tsx";
import { AnnotationSegmenter } from "./utils/AnnotationSegmenter.ts";
import { assignGroupToSegments } from "./utils/assignGroupToSegments.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { Block, BlockBuilder, BlockSchema, Element, Inline } from "./block";
import { useAnnotatedTextConfig } from "./useAnnotatedTextConfig.tsx";

type SegmentedTextProps = {
  body: string;
  offsets: TextOffsets[];
  blockSchema: BlockSchema;
};

export function SegmentedText(props: SegmentedTextProps) {
  const { body, offsets, blockSchema } = props;
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    const segments = new AnnotationSegmenter(body, offsets).segment();
    const grouped = assignGroupToSegments(segments);
    const elements = new BlockBuilder(blockSchema).build(grouped);
    setElements(elements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  return (
    <span style={{ display: "block" }}>
      <Elements elements={elements} />
    </span>
  );
}

function Elements(props: { elements: Element[] }) {
  return props.elements.map((e, i) =>
    e.isBlock ? (
      <BlockElement key={e.id} block={e} />
    ) : (
      <InlineElement key={i} inline={e} />
    ),
  );
}

function InlineElement(props: { inline: Inline }) {
  const grouped = groupSegmentsByGroupId(props.inline.segments);
  return grouped.map((group, i) => <SegmentGroup key={i} group={group} />);
}

function BlockElement(props: { block: Block }) {
  const { Block } = useAnnotatedTextConfig();
  return (
    <Block block={props.block.annotation}>
      <Elements elements={props.block.children} />
    </Block>
  );
}
