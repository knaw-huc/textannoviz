import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import {
  cell,
  head,
  page,
  paragraph,
  row,
  table,
} from "../ProjectAnnotationModel.ts";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { Paragraph } from "./Paragraph.tsx";
import { Page } from "./Page.tsx";
import { TocHeader } from "./TocHeader.tsx";

export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === page) {
    return <Page {...props} />;
  }
  if (block.blockType === paragraph) {
    return <Paragraph {...props} />;
  }
  if (tableTypes.includes(block.blockType)) {
    return <TableRowCell {...props} />;
  }
  if (block.blockType === head) {
    return <TocHeader {...props} />;
  }
  return <div className={block.blockType}>{children}</div>;
}

export const tableTypes = [table, row, cell];

export function TableRowCell(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === table) {
    return (
      <table>
        <tbody>{children}</tbody>
      </table>
    );
  } else if (block.blockType === row) {
    console.log("tr", block.annotation);
    return <tr>{children}</tr>;
  } else if (block.blockType === cell) {
    return <td>{children}</td>;
  }
}
