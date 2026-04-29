import { TextOffsets } from "./AnnotationModel.ts";
import { SegmentGroup } from "./inline/SegmentGroup.tsx";
import { createSegments } from "./utils/createSegments.ts";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import {
  Block,
  BlockSchema,
  createBlocks,
  Element,
  Inline,
  removeInvalidElements,
} from "./block";
import { useAnnotatedTextConfig } from "./useAnnotatedTextConfig.tsx";
import { useMemo } from "react";

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

  return <Elements elements={elements} />;
}

export function Elements(props: { elements: Element[] }) {
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
