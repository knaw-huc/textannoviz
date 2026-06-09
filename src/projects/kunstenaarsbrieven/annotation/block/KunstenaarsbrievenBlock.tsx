import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import {
  cell,
  head,
  list,
  listItem,
  page,
  paragraph,
  row,
  table,
} from "../ProjectAnnotationModel.ts";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { Paragraph } from "./Paragraph.tsx";
import { Page } from "./Page.tsx";
import { TocHeader } from "./TocHeader.tsx";
import { LazyTableAndRows } from "./LazyTableAndRows.tsx";
import { ListAndListItems } from "./ListAndListItems.tsx";

/**
 * See {@link import("../ProjectAnnotationModel.ts").blockSchema}
 */
export function KunstenaarsbrievenBlock(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === page) {
    return <Page {...props} />;
  }
  if (block.blockType === paragraph) {
    return <Paragraph {...props} />;
  }

  // Tables, rows and cells:
  if (block.blockType === table) {
    return <LazyTableAndRows block={block} />;
  }
  if (block.blockType === row) {
    // Rows are rendered by table:
    return null;
  }
  if (block.blockType === cell) {
    return <td>{children}</td>;
  }

  if (block.blockType === head) {
    return <TocHeader {...props} />;
  }

  // Lists and list items:
  if (block.blockType === list) {
    return <ListAndListItems block={block} />;
  }
  if (block.blockType === listItem) {
    // List items are rendered by list:
    return null;
  }

  return <div className={block.blockType}>{children}</div>;
}
