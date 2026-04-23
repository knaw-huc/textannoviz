import { BlockProps } from "../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { head, isQuote, paragraph } from "./ProjectAnnotationModel.ts";
import { BlockTocHeader } from "./BlockTocHeader.tsx";
import { Element, Segment } from "../../../components/Text/Annotated/core";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  const segments = findBlockSegments(block.children);

  if (block.blockType === paragraph) {
    const isBlockquote = segments.every((s) => s.annotations.some(isQuote));
    if (isBlockquote) {
      return <blockquote>{children}</blockquote>;
    }
    return <p>{children}</p>;
  }
  if (block.blockType === head) {
    return <BlockTocHeader {...props} />;
  }
  return <div className={block.blockType}>{children}</div>;
}

function findBlockSegments(elements: Element[]): Segment[] {
  return elements.flatMap((e) =>
    e.isBlock ? findBlockSegments(e.children) : e.segments,
  );
}
