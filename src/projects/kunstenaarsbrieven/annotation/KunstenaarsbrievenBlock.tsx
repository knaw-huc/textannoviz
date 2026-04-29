import { BlockProps } from "../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { head, isQuote, page, paragraph } from "./ProjectAnnotationModel.ts";
import { BlockTocHeader } from "./BlockTocHeader.tsx";
import { Element, Segment } from "../../../components/Text/Annotated/core";
import { AnnoRepoBody, isPageBody } from "../../../model/AnnoRepoAnnotation.ts";
import { PageMarker } from "../../default/annotation/marker/PageMarker.tsx";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === page) {
    if (!isPageBody(block.annotation.body)) {
      throw new Error(
        `Expected PageBody: ${JSON.stringify(block.annotation.body)}`,
      );
    }
    return (
      <div className="page">
        <PageMarker body={block.annotation.body} />
        {children}
      </div>
    );
  }

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
