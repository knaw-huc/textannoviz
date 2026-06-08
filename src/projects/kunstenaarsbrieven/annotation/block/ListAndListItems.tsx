import { Block } from "../../../../components/Text/Annotated/core";
import { Elements } from "../../../../components/Text/Annotated/core/Elements.tsx";

type ListProps = {
  block: Block;
};

/**
 * Render both a List and its ListItem children
 */
export function ListAndListItems({ block }: ListProps) {
  const listItems = block.children.filter((e) => e.isBlock) as Block[];
  return (
    <ul>
      {listItems.map((li) => (
        <li key={li.id}>
          <Elements elements={li.children} />
        </li>
      ))}
    </ul>
  );
}
