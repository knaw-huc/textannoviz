import { useEffect, useState } from "react";
import { TextOffsets } from "./AnnotationModel.ts";
import { SegmentGroup } from "./inline/SegmentGroup.tsx";
import { createSegments } from "./utils/createSegments.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { Block, BlockSchema, createBlocks, Element, Inline } from "./block";
import { useAnnotatedTextConfig } from "./useAnnotatedTextConfig.tsx";
import { removeInvalidElements } from "./block";

type SegmentedTextProps = {
  body: string;
  offsets: TextOffsets[];
  blockSchema: BlockSchema;
};

export function SegmentedText(props: SegmentedTextProps) {
  const { body, offsets, blockSchema } = props;
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    console.time("segment-and-block");
    const segments = createSegments(body, offsets, blockSchema);
    const elements = createBlocks(segments);
    const cleaned = removeInvalidElements(elements, blockSchema);
    setElements(cleaned);
    console.timeEnd("segment-and-block");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body]);

  return <Elements elements={elements} />;
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
  const { segments } = props.inline;
  const begin = segments[0].index;
  const end = segments.at(-1)!.index + 1;
  const grouped = groupSegmentsByGroupId(props.inline.segments, { begin, end });

  return grouped.map((group, i) => <SegmentGroup key={i} group={group} />);
}

function BlockElement(props: { block: Block }) {
  const { Block } = useAnnotatedTextConfig();
  return (
    <Block block={props.block}>
      <Elements elements={props.block.children} />
    </Block>
  );
}
