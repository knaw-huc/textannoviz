import _, { debounce, groupBy } from "lodash";
import React from "react";
import { Facet, FacetName, SearchQuery, Terms } from "../../model/Search.ts";
import {
  projectNameSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent.tsx";
import { FacetItemsFilter } from "./FacetItemsFilter.tsx";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

type FacetEntry = [FacetName, number];

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
  const { searchQuery, updateSearchQuery } = useUrlSearchParamsStore();
  const facetLength = Object.keys(props.facet).length;
  const translateProject = useProjectStore(translateProjectSelector);
  const projectName = useProjectStore(projectNameSelector);
  const [selected, setSelected] = React.useState<string[]>(
    props.selectedFacets[props.facetName] ?? [],
  );
  const [filteredFacets, setFilteredFacets] = React.useState<FacetEntry[]>([]);
  const [filterValue, setFilterValue] = React.useState<string>("");

  const sortOrder = searchQuery.aggs?.find(
    (agg) => agg.facetName === props.facetName,
  )?.order;

  const maxFacetItemsVisible = 100;

  React.useEffect(() => {
    const entries = Object.entries(props.facet);
    const selectedFacets = props.selectedFacets[props.facetName] || [];
    const { true: selected, false: notSelected } = groupBy(entries, ([name]) =>
      selectedFacets.includes(name),
    );

    /*
      - notSelected can be undefined when ALL facet items are selected
      - if notSelected is NOT undefined, it should set the filtered facets to both selected and sliced items
      - if notSelected is undefined, it should only set the filtered facets to the selected items
    */
    if (notSelected) {
      const filtered = notSelected.filter(([facetValueName]) =>
        facetValueName.toLowerCase().includes(filterValue.toLowerCase()),
      );
      const sliced =
        filtered.length > maxFacetItemsVisible
          ? filtered.slice(0, maxFacetItemsVisible)
          : filtered;
      setFilteredFacets([...(selected || []), ...sliced]);
    } else {
      setFilteredFacets([...(selected || [])]);
    }
  }, [props.facet, filterValue, props.selectedFacets, props.facetName]);

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

    updateSearchQuery(newQuery);

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
        {filteredFacets.map(([facetValueName, facetValueCount], index) => {
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
        {(projectName === "republic" ||
          projectName === "israels" ||
          projectName === "vangogh") &&
        facetLength > 10 ? (
          //TODO: make generic
          <span className="pl-2 text-sm text-neutral-500">
            {Math.min(maxFacetItemsVisible, facetLength)} van {facetLength}{" "}
            items.{" "}
            {maxFacetItemsVisible < facetLength ? (
              <>
                Gebruik de zoekbalk om door alle {facetLength} items te zoeken.
                {projectName === "republic" ? (
                  <>
                    {" "}
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
