import isEmpty from "lodash/isEmpty";
import React from "react";
import { ListBox, ListBoxItem, type Selection } from "react-aria-components";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { FacetEntry } from "../../model/Search.ts";

type FacetFilterProps = {
  allPossibleKeywordFacets: FacetEntry[];
  filteredKeywordFacets: string[];
  facetFilterChangeHandler: (keys: Selection) => void;
};

export function FacetFilter(props: FacetFilterProps) {
  const [selected, setSelected] = React.useState<Selection>(new Set());
  const translateProject = useProjectStore(translateProjectSelector);
  const translate = useProjectStore(translateSelector);

  React.useEffect(() => {
    if (props.filteredKeywordFacets.length > 0) {
      setSelected(new Set(props.filteredKeywordFacets));
    }
  }, [props.filteredKeywordFacets]);

  function listBoxItemToggleHandler(keys: Selection) {
    setSelected(new Set(keys));
    props.facetFilterChangeHandler(keys);
  }

  return (
    <ListBox
      aria-label={translate("FILTER_FACETS")}
      selectionMode="multiple"
      selectionBehavior="toggle"
      selectedKeys={selected}
      onSelectionChange={listBoxItemToggleHandler}
      className="border-brand1Grey-200 flex max-h-64 cursor-default flex-col gap-2 overflow-auto rounded border bg-white px-1 py-1 text-sm"
    >
      {!isEmpty(props.allPossibleKeywordFacets) &&
        props.allPossibleKeywordFacets.map(([facetLabel], index) => (
          <ListBoxItem
            key={index}
            id={facetLabel}
            className="selected:bg-brand1-200 selected:rounded-sm hover:bg-brand1-100 cursor-default px-2 py-1 outline-none"
          >
            {translateProject(facetLabel)}
          </ListBoxItem>
        ))}
    </ListBox>
  );
}
