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
      throw new Error(`Unknown page: ${JSON.stringify(block.annotation)}`);
    }
    const body = block.annotation.body;

    /**
     * The page no. need to be build up by combining the values of the f and the n attributes of the pb element.
     * In letter 001a for example, there is <pb f="1v" n="3" xml:id="pb-orig-1v-3" facs="#zone-pb-1v-3"/> which should result in the page number 1v:3.
     * See: https://github.com/knaw-huc/textannoviz/issues/564#issuecomment-4243854922
     */
    const n = body.n;
    const f = body["tei:f"];
    const label = f ? `${f}:${n}` : n;
    return (
      <div className="page">
        <PageMarker id={block.annotation.body.id} label={label} />
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
