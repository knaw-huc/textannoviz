import isEmpty from "lodash/isEmpty";
import React from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  type Selection,
} from "react-aria-components";
import { FacetEntry, FacetTypes } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { HelpTooltip } from "../common/HelpTooltip.tsx";
import { ChevronDown } from "../common/icons/ChevronDown";
import { ChevronRight } from "../common/icons/ChevronRight";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { getFacets } from "./util/getFacets.ts";

type FacetFilterProps = {
  allPossibleKeywordFacets: string[];
  filteredKeywordFacets: string[];
  searchFacetTypes: FacetTypes;
  keywordFacets: FacetEntry[];
  setFilteredAggs: (value: React.SetStateAction<string[]>) => void;
};

export function FacetFilter(props: FacetFilterProps) {
  const [selected, setSelected] = React.useState<Selection>(new Set());
  const [isOpen, setIsOpen] = React.useState(false);
  const translateProject = useProjectStore(translateProjectSelector);
  const translate = useProjectStore(translateSelector);
  const { searchQuery, updateSearchQuery } = useSearchUrlParams();
  const { setKeywordFacets } = useSearchStore();
  const projectConfig = useProjectStore(projectConfigSelector);

  React.useEffect(() => {
    if (props.filteredKeywordFacets.length > 0) {
      setSelected(new Set(props.filteredKeywordFacets));
    }
  }, [props.filteredKeywordFacets]);

  async function listBoxItemToggleHandler(keys: Selection) {
    setSelected(new Set(keys));

    const prevFilteredAggs = props.filteredKeywordFacets;
    const updatedFilteredAggs = Array.from(keys) as string[];
    const selectedNewFacet = getSelectedNewFacet(
      updatedFilteredAggs,
      prevFilteredAggs,
    );
    const removedFacet = getRemovedFacet(updatedFilteredAggs, prevFilteredAggs);
    const orderedFilteredAggs = getOrderedFilteredAggs(
      updatedFilteredAggs,
      props.searchFacetTypes,
    );

    //Only fetch new facets if the user has selected a new facet
    if (selectedNewFacet) {
      await handleNewFacetSelection(selectedNewFacet);
    }

    if (removedFacet) {
      handleFacetRemoval(removedFacet);
    }

    props.setFilteredAggs(orderedFilteredAggs);

    async function handleNewFacetSelection(selectedNewFacet: string) {
      const aborter = new AbortController();
      const newAgg = [
        {
          facetName: selectedNewFacet,
          order: "countDesc",
          size: 10,
        },
      ];

      const newAggs = [...searchQuery.aggs!, ...newAgg];

      const newFacets = await getFacets(
        projectConfig,
        newAgg,
        searchQuery,
        aborter.signal,
        searchQuery.terms,
      );

      const newKeywordFacets = filterFacetsByType(
        props.searchFacetTypes,
        newFacets,
        "keyword",
      );

      setKeywordFacets([...props.keywordFacets, ...newKeywordFacets]);
      updateSearchQuery({ aggs: newAggs });
    }

    function handleFacetRemoval(removedFacet: string) {
      const newAggs = searchQuery.aggs?.filter(
        (agg) => agg.facetName !== removedFacet,
      );
      const newKeywordFacets = props.keywordFacets.filter(
        (facet) => facet[0] !== removedFacet,
      );
      setKeywordFacets(newKeywordFacets);
      updateSearchQuery({ aggs: newAggs });
    }
  }

  return (
    <>
      <Button
        className="bg-brand1-100 hover:bg-brand1-200 pressed:bg-brand1-300 text-brand1-700 hover:text-brand1-900 fill-brand1-700 hover:fill-brand1-900 flex w-fit flex-row items-center rounded px-2 py-2 text-sm outline-none"
        onPress={() => setIsOpen(!isOpen)}
      >
        {translate("FILTER_FACETS")}{" "}
        <HelpTooltip label={translateProject("FILTER_FACETS_HELP")} />
        {!isOpen ? <ChevronRight /> : <ChevronDown />}
      </Button>
      {isOpen ? (
        <ListBox
          aria-label={translate("FILTER_FACETS")}
          selectionMode="multiple"
          selectionBehavior="toggle"
          selectedKeys={selected}
          onSelectionChange={listBoxItemToggleHandler}
          className="border-brand1Grey-200 flex max-h-64 cursor-default flex-col gap-2 overflow-auto rounded border bg-white px-1 py-1 text-sm"
        >
          {!isEmpty(props.allPossibleKeywordFacets) &&
            props.allPossibleKeywordFacets.map((facetLabel, index) => (
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

function getOrderedFilteredAggs(
  updatedFilteredAggs: string[],
  searchFacetTypes: FacetTypes,
): string[] {
  return Object.entries(searchFacetTypes)
    .map(([name]) => name)
    .filter((name) => updatedFilteredAggs.includes(name));
}

function getRemovedFacet(
  updatedFilteredAggs: string[],
  prevFilteredAggs: string[],
): string {
  return prevFilteredAggs
    .filter(
      (prevFilteredFacet) => !updatedFilteredAggs.includes(prevFilteredFacet),
    )
    .toString();
}

function getSelectedNewFacet(
  updatedFilteredAggs: string[],
  prevFilteredAggs: string[],
): string {
  return updatedFilteredAggs
    .filter(
      (updatedFilteredAgg) => !prevFilteredAggs.includes(updatedFilteredAgg),
    )
    .toString();
}
