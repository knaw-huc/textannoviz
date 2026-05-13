import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { isQuote } from "../ProjectAnnotationModel.ts";
import { findBlockSegments } from "./findBlockSegments.tsx";
import { id } from "../../../../components/Text/Annotated/core/debugAnno.ts";

export function Paragraph({ block, children }: BlockProps<AnnoRepoBody>) {
  const segments = findBlockSegments(block.children);
  const isBlockquote = segments.every((s) => s.annotations.some(isQuote));
  if (isBlockquote) {
    return <blockquote>{children}</blockquote>;
  }
  return <p id={id(block.id)}>{children}</p>;
}
