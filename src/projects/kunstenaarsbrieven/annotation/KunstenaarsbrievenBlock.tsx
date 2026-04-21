import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import { BlockProps } from "../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { paragraph } from "./ProjectAnnotationModel.ts";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;
  if (block.blockType === paragraph) {
    return <p>{children}</p>;
  }
  return <div>{children}</div>;
}
