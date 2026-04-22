import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import { BlockProps } from "../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { head, paragraph } from "./ProjectAnnotationModel.ts";
import { BlockTocHeader } from "./BlockTocHeader.tsx";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;
  if (block.blockType === paragraph) {
    return <p>{children}</p>;
  }
  if (block.blockType === head) {
    return <BlockTocHeader {...props} />;
  }
  return <div className={block.blockType}>{children}</div>;
}
