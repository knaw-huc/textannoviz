import isEmpty from "lodash/isEmpty";
import React from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  type Selection,
} from "react-aria-components";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { FacetEntry } from "../../stores/search/search-query-slice";
import { ChevronDown } from "../common/icons/ChevronDown";
import { ChevronRight } from "../common/icons/ChevronRight";

type FacetFilterProps = {
  allPossibleKeywordFacets: FacetEntry[];
  filteredKeywordFacets: string[];
  facetFilterChangeHandler: (keys: Selection) => void;
};

export function FacetFilter(props: FacetFilterProps) {
  const [selected, setSelected] = React.useState<Selection>(new Set());
  const [isOpen, setIsOpen] = React.useState(false);
  const translateProject = useProjectStore(translateProjectSelector);

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
        className="bg-brand1-100 hover:bg-brand1-200 pressed:bg-brand1-300 text-brand1-700 hover:text-brand1-900 fill-brand1-700 hover:fill-brand1-900 flex w-fit flex-row items-center rounded px-2 py-2 text-sm outline-none"
        onPress={() => setIsOpen(!isOpen)}
      >
        Filter facets {!isOpen ? <ChevronRight /> : <ChevronDown />}
      </Button>
      {isOpen ? (
        <ListBox
          aria-label="Filter facets"
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
      ) : null}
    </>
  );
}
