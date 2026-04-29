import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { cell, row, table } from "../ProjectAnnotationModel.ts";

export function TableRowCell(props: BlockProps<AnnoRepoBody>) {
  const { block, children } = props;

  if (block.blockType === table) {
    return (
      <table>
        <tbody>{children}</tbody>
      </table>
    );
  } else if (block.blockType === row) {
    return <tr>{children}</tr>;
  } else if (block.blockType === cell) {
    return <td>{children}</td>;
  }
}
