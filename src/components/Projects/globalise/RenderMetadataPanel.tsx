import { AnnoRepoAnnotation } from "../../../model/AnnoRepoAnnotation";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  console.log(props.annotations);
  return <div>Testing</div>;
};
