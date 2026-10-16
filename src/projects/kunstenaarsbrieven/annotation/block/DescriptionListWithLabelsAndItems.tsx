import { Fragment } from "react";
import { Block, Element } from "../../../../components/Text/Annotated/core";
import { Elements } from "../../../../components/Text/Annotated/core/Elements.tsx";
import { AnnoRepoBody } from "../../../../model/AnnoRepoAnnotation.ts";
import { head, isListBody, listItem } from "../ProjectAnnotationModel.ts";

type DescriptionListProps = {
  block: Block<AnnoRepoBody>;
};

type LabelAndItem = {
  label: Element[];
  item: Block;
};

export function DescriptionListWithLabelsAndItems({
  block,
}: DescriptionListProps) {
  const { heads = [], labelAndItems = [] } = Object.groupBy(
    block.children,
    (e) => (e.isBlock && e.blockType === head ? "heads" : "labelAndItems"),
  );
  const body = block.annotation.body;
  const className = isListBody(body) ? body["tei:type"] : "";

  return (
    <>
      <Elements elements={heads} />
      <dl className={className}>
        {pairLabelAndItems(labelAndItems).map(({ label, item }) => (
          <Fragment key={item.id}>
            <dt>
              <Elements elements={label} />
            </dt>
            <dd>
              <Elements elements={item.children} />
            </dd>
          </Fragment>
        ))}
      </dl>
    </>
  );
}

function pairLabelAndItems(children: Element[]): LabelAndItem[] {
  const pairs: LabelAndItem[] = [];
  let labelElements: Element[] = [];

  for (const child of children) {
    if (!child.isBlock) {
      labelElements.push(child);
      continue;
    }
    if (child.blockType === listItem) {
      pairs.push({ label: labelElements, item: child });
    } else {
      console.error(`Found ${child.blockType} instead of ${listItem}`);
    }
    labelElements = [];
  }

  return pairs;
}
