import { Block } from "../../../../components/Text/Annotated/core";
import { Elements } from "../../../../components/Text/Annotated/core/Elements.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { isListBody } from "../ProjectAnnotationModel.ts";

type ListProps = {
  block: Block<AnnoRepoBody>;
};

/**
 * Render both a List and its ListItem children
 */
export function ListAndListItems({ block }: ListProps) {
  const listItems = block.children.filter(
    (e) => e.isBlock,
  ) as Block<AnnoRepoBody>[];
  const body = block.annotation.body;

  const className = isListBody(body) ? `list ${body["tei:type"]}` : "";

  return (
    <ul className={className}>
      {listItems.map((li) => (
        <li key={li.id}>
          <Elements elements={li.children} />
        </li>
      ))}
    </ul>
  );
}
