import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import {
  head,
  page,
  paragraph,
  tableTypes,
} from "../ProjectAnnotationModel.ts";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { Paragraph } from "./Paragraph.tsx";
import { Page } from "./Page.tsx";
import { TocHeader } from "./TocHeader.tsx";
import { RowCellTable } from "./RowCellTable.tsx";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === page) {
    return <Page {...props} />;
  }
  if (block.blockType === paragraph) {
    return <Paragraph {...props} />;
  }
  if (tableTypes.includes(block.blockType)) {
    return <RowCellTable {...props} />;
  }
  if (block.blockType === head) {
    return <TocHeader {...props} />;
  }
  return <div className={block.blockType}>{children}</div>;
}
