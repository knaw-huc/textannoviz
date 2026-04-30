import { Block, Element, Inline } from "./block";
import { SegmentGroup } from "./inline/SegmentGroup.tsx";
import { groupSegmentsByGroupId } from "./utils/groupSegmentsByGroupId.ts";
import { useAnnotatedTextConfig } from "./useAnnotatedTextConfig.tsx";

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
