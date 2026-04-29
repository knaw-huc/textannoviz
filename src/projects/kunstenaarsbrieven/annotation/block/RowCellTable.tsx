import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { cell, table } from "../ProjectAnnotationModel.ts";
import { VirtualTable } from "./VirtualTable.tsx";

export function RowCellTable(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === table) {
    return <VirtualTable block={block} />;
  } else if (block.blockType === cell) {
    return <td>{children}</td>;
  }
}
