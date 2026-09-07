import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import {
  AnnoRepoBody,
  isPageBody,
} from "../../../../model/AnnoRepoAnnotation.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import { PageMarker } from "../../../default/annotation/marker/PageMarker.tsx";

export function Page({ block, children }: BlockProps<AnnoRepoBody>) {
  if (!isPageBody(block.annotation.body)) {
    throw new Error(`Unknown page: ${JSON.stringify(block.annotation)}`);
  }
  const body = block.annotation.body;

  const label = useProjectStore(projectConfigSelector).pageLabelFormat(body);

  return (
    <div className="page">
      <PageMarker id={block.annotation.body.id} label={label} />
      {children}
    </div>
  );
}
