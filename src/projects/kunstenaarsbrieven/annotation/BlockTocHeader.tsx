import { BlockProps } from "../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import { getTocId } from "../TocUtils.ts";
import { tocScrollHeader } from "../../../components/Text/Toc/useSyncHeaderOnScroll.tsx";

export function BlockTocHeader(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  const tocId = getTocId(block.annotation.body);
  return (
    <h2 id={tocId} className={tocScrollHeader}>
      {children}
    </h2>
  );
}
