import { useEffect, useState } from "react";
import { TextOffsets } from "../AnnotationModel.ts";
import { SegmentGroup } from "./SegmentGroup.tsx";
import { AnnotationSegmenter } from "../utils/AnnotationSegmenter.ts";
import { groupSegmentsByGroupId } from "../utils/groupSegmentsByGroupId.ts";
import { listOffsetsByChar } from "../utils/listOffsetsByChar.ts";
import { BlockBuilder, BlockSchema } from "../block";
import { useAnnotatedTextConfig } from "../useAnnotatedTextConfig.tsx";
import { Element, Inline, Block as BlockModel } from "../block";

type SegmentedTextProps = {
  body: string;
  offsets: TextOffsets[];
  blockSchema: BlockSchema;
};

export function SegmentedText(props: SegmentedTextProps) {
  const { body, offsets, blockSchema } = props;
  const [elements, setElements] = useState<Element[]>([]);

  const offsetsByChar = listOffsetsByChar(offsets);

  useEffect(() => {
    const segments = new AnnotationSegmenter(body, offsetsByChar).segment();
    const builder = new BlockBuilder(blockSchema);
    setElements(builder.build(segments));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

function BlockElement(props: { block: BlockModel }) {
  const { Block } = useAnnotatedTextConfig();
  return (
    <Block block={props.block.annotation}>
      <Elements elements={props.block.children} />
    </Block>
  );
}
