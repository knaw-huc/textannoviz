import isEmpty from "lodash/isEmpty";
import React from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  type Selection,
} from "react-aria-components";
import { FacetEntry } from "../../stores/search/search-query-slice";

type FacetFilterProps = {
  allPossibleKeywordFacets: FacetEntry[];
  filteredKeywordFacets: string[];
  facetFilterChangeHandler: (keys: Selection) => void;
};

export function FacetFilter(props: FacetFilterProps) {
  const [selected, setSelected] = React.useState<Selection>(new Set());
  const [isOpen, setIsOpen] = React.useState(false);

  console.log(selected);

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
    <>
      <Button
        className="bg-brand1-100 hover:bg-brand1-200 pressed:bg-brand1-300 text-brand1-700 hover:text-brand1-900 rounded px-2 py-2 text-sm outline-none"
        onPress={() => setIsOpen(!isOpen)}
      >
        Filter facets
      </Button>
      {isOpen ? (
        <ListBox
          aria-label="Filter facets"
          selectionMode="multiple"
          selectionBehavior="toggle"
          selectedKeys={selected}
          onSelectionChange={listBoxItemToggleHandler}
          className="border-2 border-black"
        >
          {!isEmpty(props.allPossibleKeywordFacets) &&
            props.allPossibleKeywordFacets.map(([facetLabel], index) => (
              <ListBoxItem
                key={index}
                id={facetLabel}
                className="selected:bg-brand1-200 cursor-default outline-none"
              >
                {facetLabel}
              </ListBoxItem>
            ))}
        </ListBox>
      ) : null}
    </>
  );
}
