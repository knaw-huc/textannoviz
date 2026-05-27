import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { isParagraphBody, isQuote } from "../ProjectAnnotationModel.ts";
import { findBlockSegments } from "./findBlockSegments.tsx";

export function Paragraph({ block, children }: BlockProps<AnnoRepoBody>) {
  const segments = findBlockSegments(block.children);
  const isBlockquote = segments.every((s) => s.annotations.some(isQuote));
  if (isBlockquote) {
    return <blockquote>{children}</blockquote>;
  }

  const paragraphClassName =
    isParagraphBody(block.annotation.body) &&
    block.annotation.body.style === "indent"
      ? "paragraph-indent"
      : "";

  return <p className={paragraphClassName}>{children}</p>;
}
