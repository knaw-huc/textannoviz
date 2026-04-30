import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { getTocId } from "../../TocUtils.ts";
import { tocScrollHeader } from "../../../../components/Text/Toc/useSyncHeaderOnScroll.tsx";
import { isHeadBody } from "../ProjectAnnotationModel.ts";

export function TocHeader(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  const tocId = getTocId(block.annotation.body);
  return (
    <h2 id={tocId} className={tocScrollHeader}>
      <TocPrefix {...props} />
      {children}
    </h2>
  );
}

export function TocPrefix({ block }: BlockProps<AnnoRepoBody>) {
  const body = block.annotation.body;
  if (!isHeadBody(body) || !body.n) {
    return null;
  }
  return <span className="insert-marker marker-head">{body.n}. </span>;
}
