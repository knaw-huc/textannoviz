import React from "react";
import type { Key } from "react-aria-components";
import { toast } from "react-toastify";
import { ASC, DESC, FacetName, SortOrder } from "../../model/Search.ts";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";

export type Sorting = {
  field: string;
  order: SortOrder;
};

interface SearchSortByProps {
  onSort: (sortBy: Sorting) => void;
  selected: Sorting;
  dateFacet?: FacetName;
}

const SEPARATOR = "-";
const BY_DATE = "date";
const BY_SCORE = "_score";

/**
 * Sort by _score or by date
 * TODO:
 *  - add keyword facet types
 *  - handle multiple date facets
 */
export const SearchSorting = (props: SearchSortByProps) => {
  const translate = useProjectStore(translateSelector);
  const defaultSorting: Sorting = { field: BY_SCORE, order: DESC };
  const [selectedKey, setSelectedKey] = React.useState<Key>(
    `${BY_SCORE}-${DESC}`,
  );

  function handleSorting(key: Key) {
    setSelectedKey(key);
    const [selectedField, selectedOrder] = (key as string).split(SEPARATOR);
    if (selectedField === BY_DATE) {
      handleDateSorting(selectedOrder as SortOrder);
    } else {
      props.onSort(defaultSorting);
    }
  }

  function handleDateSorting(selectedOrder: SortOrder) {
    const dateFacet = props.dateFacet;
    if (!dateFacet) {
      toast("No date facets to sort by");
      props.onSort(defaultSorting);
      return;
    }
    props.onSort({
      field: dateFacet,
      order: selectedOrder,
    });
  }

  const options = [
    { name: translate("RELEVANCE"), value: `${BY_SCORE}-${DESC}` },
    { name: translate("DATE_ASC"), value: `${BY_DATE}-${ASC}` },
    { name: translate("DATE_DESC"), value: `${BY_DATE}-${DESC}` },
  ];

  return (
    <SelectComponent
      label={translate("SORT_BY")}
      labelStyling="mr-1 text-sm"
      buttonWidth="w-[200px]"
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={handleSorting}
    >
      {(item) => (
        <SelectItemComponent id={item.value} textValue={item.name}>
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
