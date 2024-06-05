import React from "react";
import { Facet, Terms } from "../../model/Search.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent.tsx";

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
}) {
  const facetLength = Object.keys(props.facet).length;
  const { searchQuery, setSearchQuery } = useSearchStore();
  const translateProject = useProjectStore(translateProjectSelector);
  const [selected, setSelected] = React.useState<string[]>(
    props.selectedFacets[props.facetName] ?? [],
  );

  function checkboxChangeHandler(newSelected: string[]) {
    setSelected(newSelected);
  }

  function sortIconClickHandler(aggregation: string, orderBy: string) {
    const prevAggs = searchQuery.aggs;

    const newAggs = prevAggs?.map((prevAgg) => {
      if (prevAgg.startsWith(aggregation)) {
        return `${aggregation}:${orderBy}`;
      }

      return prevAgg;
    });

    setSearchQuery({
      ...searchQuery,
      aggs: newAggs,
    });

    props.onSearch();
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
          },
        )}
      </CheckboxGroupComponent>
    </>
  );
}
