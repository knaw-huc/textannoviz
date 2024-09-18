import React from "react";
import { Facet, Terms } from "../../model/Search.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchQuery } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent.tsx";

export function CheckboxFacet(props: {
  facetName: string;
  facet: Facet;
  selectedFacets: Terms;
  onChangeCheckboxFacet: (
    facetName: string,
    facetValueName: string,
    selected: boolean,
  ) => void;
  onSearch: (stayOnPage?: boolean) => void;
  updateAggs: (query: SearchQuery) => void;
}) {
  const facetLength = Object.keys(props.facet).length;
  const { searchQuery, setSearchQuery } = useSearchStore();
  const translateProject = useProjectStore(translateProjectSelector);
  const [selected, setSelected] = React.useState<string[]>(
    props.selectedFacets[props.facetName] ?? [],
  );

  const sortOrder = searchQuery.aggs?.find(
    (agg) => agg.facetName === props.facetName,
  )?.order;

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

  return (
    <>
      <CheckboxGroupComponent
        translatedLabel={translateProject(props.facetName)}
        dataLabel={props.facetName}
        value={selected}
        onChange={checkboxChangeHandler}
        sortIconClickHandler={sortIconClickHandler}
        facetLength={facetLength}
        sortOrder={sortOrder}
      >
        {Object.entries(props.facet).map(
          ([facetValueName, facetValueCount], index) => {
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
                    props.onChangeCheckboxFacet(
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
          },
        )}
      </CheckboxGroupComponent>
    </>
  );
}
