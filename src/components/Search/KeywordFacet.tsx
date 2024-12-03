import _, { debounce } from "lodash";
import React from "react";
import { Facet, Terms } from "../../model/Search.ts";
import {
  projectNameSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchQuery } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent.tsx";
import { FacetItemsFilter } from "./FacetItemsFilter.tsx";

export function KeywordFacet(props: {
  facetName: string;
  facet: Facet;
  selectedFacets: Terms;
  onChangeKeywordFacet: (
    facetName: string,
    facetValueName: string,
    selected: boolean,
  ) => void;
  onSearch: (stayOnPage?: boolean) => void;
  updateAggs: (query: SearchQuery) => void;
}) {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const translateProject = useProjectStore(translateProjectSelector);
  const projectName = useProjectStore(projectNameSelector);
  const [selected, setSelected] = React.useState<string[]>(
    props.selectedFacets[props.facetName] ?? [],
  );
  const [filteredFacets, setFilteredFacets] = React.useState<Facet>(
    props.facet,
  );
  const [filterValue, setFilterValue] = React.useState<string>("");
  const facetLength = Object.keys(filteredFacets).length;

  const sortOrder = searchQuery.aggs?.find(
    (agg) => agg.facetName === props.facetName,
  )?.order;

  const maxFacetItemsVisible = 100;
  const slicedFacetItems =
    facetLength > maxFacetItemsVisible
      ? Object.entries(filteredFacets).slice(0, maxFacetItemsVisible)
      : Object.entries(filteredFacets);

  React.useEffect(() => {
    const filterFacetItems = (value: string) => {
      return Object.fromEntries(
        Object.entries(props.facet).filter(([facetValueName]) =>
          facetValueName.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    };

    setFilteredFacets(filterFacetItems(filterValue));
  }, [props.facet, filterValue]);

  function checkboxChangeHandler(newSelected: string[]) {
    setSelected(newSelected);
  }

  function sortIconClickHandler(aggregation: string, orderBy: string) {
    const prevAggs = searchQuery.aggs;

    const newAggs = prevAggs?.map((prevAgg) => {
      if (!prevAgg.facetName.startsWith(aggregation)) return prevAgg;

      const newAgg = {
        ...prevAgg,
        order: orderBy,
      };

      return newAgg;
    });

    const newQuery = {
      ...searchQuery,
      aggs: newAggs,
    };

    setSearchQuery(newQuery);

    props.updateAggs(newQuery);
  }

  const debouncedFilterFacets = React.useMemo(
    () =>
      debounce((value: string) => {
        setFilterValue(value);
      }, 300),
    [],
  );

  function inputFilterOnChangeHandler(value: string) {
    debouncedFilterFacets(value);
  }

  return (
    <>
      <CheckboxGroupComponent
        translatedLabel={translateProject(props.facetName)}
        helpLabel={translateProject(toFacetHelpLabelKey(props.facetName))}
        dataLabel={props.facetName}
        value={selected}
        onChange={checkboxChangeHandler}
        sortIconClickHandler={sortIconClickHandler}
        facetLength={facetLength}
        sortOrder={sortOrder}
      >
        <FacetItemsFilter
          inputFilterOnChangeHandler={inputFilterOnChangeHandler}
        />
        {slicedFacetItems.map(([facetValueName, facetValueCount], index) => {
          const isSelected =
            !!props.selectedFacets[props.facetName]?.includes(facetValueName);
          const facetOptionKey = `${props.facetName}-${facetValueName}`;
          return (
            <div
              key={index}
              className="flex w-full flex-row items-center justify-between"
            >
              <CheckboxComponent
                id={facetOptionKey}
                key={index}
                value={facetValueName}
                onChange={() =>
                  props.onChangeKeywordFacet(
                    props.facetName,
                    facetValueName,
                    !isSelected,
                  )
                }
                isSelected={isSelected}
              >
                {translateProject(facetValueName)}
              </CheckboxComponent>
              <div className="pr-2 text-sm text-neutral-500">
                {facetValueCount}
              </div>
            </div>
          );
        })}
        {projectName === "republic" && facetLength > 10 ? (
          //TODO: make generic
          <span className="pl-2 text-sm text-neutral-500">
            {Math.min(maxFacetItemsVisible, facetLength)} van {facetLength}{" "}
            items.{" "}
            {maxFacetItemsVisible < facetLength ? (
              <>
                Gebruik de zoekbalk om door alle {facetLength} items te zoeken.
                In de{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://entiteiten.goetgevonden.nl"
                >
                  entiteitenbrowser
                </a>{" "}
                kun je alle entiteiten vinden.
              </>
            ) : null}
          </span>
        ) : null}
      </CheckboxGroupComponent>
    </>
  );
}

function toFacetHelpLabelKey(name: string) {
  return `${_.snakeCase(name).toUpperCase()}_HELP`;
}
