import { debounce } from "lodash";
import React from "react";
import { FlatFacet, NestedAggregation, Terms } from "../../model/Search";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { SearchQuery } from "../../stores/search/search-query-slice";
import { useSearchStore } from "../../stores/search/search-store";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent";
import { ShowLessButton } from "./ShowLessButton";
import { ShowMoreButton } from "./ShowMoreButton";
import { getIsSelected } from "./util/getIsSelected";
import { getSortOrder, isSimpleAggregation } from "./util/getSortOrder";

type ShowMoreClickedState = Record<string, boolean>;

export function FlatCheckboxFacet(props: {
  facetName: string;
  labelName: string;
  facet: FlatFacet;
  selectedFacets: Terms;
  onChangeCheckboxFacet: (
    facetName: string,
    labelName: string,
    facetValueName: string,
    selected: boolean,
  ) => void;
  onSearch: (stayOnPage?: boolean) => void;
  updateAggs: (query: SearchQuery) => void;
}) {
  const { searchQuery, setSearchQuery } = useSearchStore();
  const translateProject = useProjectStore(translateProjectSelector);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [showMoreClicked, setShowMoreClicked] =
    React.useState<ShowMoreClickedState>({});
  const [filteredFacets, setFilteredFacets] = React.useState<FlatFacet>(
    props.facet,
  );
  const facetLength = Object.keys(filteredFacets).length;

  React.useEffect(() => {
    Object.entries(props.selectedFacets).map(([key, value]) => {
      if (props.labelName.startsWith(key)) {
        if (Array.isArray(value)) {
          setSelected(value);
        } else if (typeof value === "object") {
          setSelected(value[props.facetName]);
        }
      }
    });
  }, [props.selectedFacets]);

  React.useEffect(() => {
    setFilteredFacets(props.facet);
  }, [props.facet]);

  const sortOrder = getSortOrder(
    searchQuery.aggs!,
    props.labelName,
    props.facetName,
  );

  function checkboxChangeHandler(newSelected: string[]) {
    setSelected(newSelected);
  }

  function sortIconClickHandler(aggregation: string, orderBy: string) {
    const prevAggs = searchQuery.aggs;
    if (!prevAggs) return;

    const foundAgg = prevAggs.find((agg) =>
      Object.keys(agg).some((key) => aggregation.startsWith(key)),
    );

    if (!foundAgg) return;

    const topLevelKey = Object.keys(foundAgg).find((key) =>
      aggregation.startsWith(key),
    );

    if (!topLevelKey) return;

    const currentAgg = foundAgg[topLevelKey];

    function updateNestedProperty(
      obj: NestedAggregation,
      subKey: string,
      orderBy: string,
    ) {
      if (subKey in obj && "order" in obj[subKey]) {
        return {
          ...obj,
          [subKey]: {
            ...obj[subKey],
            order: orderBy,
          },
        };
      }
      return obj;
    }

    //verandert bv. 'entitiesName' naar 'name'
    const subKey = aggregation.replace(topLevelKey, "").toLowerCase();

    const newAggs = prevAggs.map((prevAgg) => {
      if (prevAgg === foundAgg)
        if (isSimpleAggregation(currentAgg)) {
          return {
            ...prevAgg,
            [topLevelKey]: {
              ...currentAgg,
              order: orderBy,
            },
          };
        }

      if (typeof currentAgg === "object" && subKey) {
        const updatedAgg = updateNestedProperty(
          currentAgg as NestedAggregation,
          subKey,
          orderBy,
        );
        return {
          ...prevAgg,
          [topLevelKey]: updatedAgg,
        };
      }

      return prevAgg;
    });

    const newQuery = {
      ...searchQuery,
      aggs: newAggs,
    };

    setSearchQuery(newQuery);

    props.updateAggs(newQuery);
  }

  function showMoreButtonClickHandler(aggregation: string) {
    const prevAggs = searchQuery.aggs;
    if (!prevAggs) return;

    const foundAgg = prevAggs.find((agg) =>
      Object.keys(agg).some((key) => aggregation.startsWith(key)),
    );

    if (!foundAgg) return;

    const topLevelKey = Object.keys(foundAgg).find((key) =>
      aggregation.startsWith(key),
    );

    if (!topLevelKey) return;

    const currentAgg = foundAgg[topLevelKey];

    function updateNestedProperty(
      obj: NestedAggregation,
      subKey: string,
      size: number,
    ) {
      if (subKey in obj && "size" in obj[subKey]) {
        return {
          ...obj,
          [subKey]: {
            ...obj[subKey],
            size: size,
          },
        };
      }
      return obj;
    }

    //verandert bv. 'entitiesName' naar 'name'
    const subKey = aggregation.replace(topLevelKey, "").toLowerCase();

    const newAggs = prevAggs.map((prevAgg) => {
      if (prevAgg === foundAgg)
        if (isSimpleAggregation(currentAgg)) {
          return {
            ...prevAgg,
            [topLevelKey]: {
              ...currentAgg,
              size: showMoreClicked[aggregation] ? 10 : 9999,
            },
          };
        }

      if (typeof currentAgg === "object" && subKey) {
        const updatedAgg = updateNestedProperty(
          currentAgg as NestedAggregation,
          subKey,
          showMoreClicked[aggregation] ? 10 : 9999,
        );
        return {
          ...prevAgg,
          [topLevelKey]: updatedAgg,
        };
      }

      return prevAgg;
    });

    console.log(newAggs);

    const newQuery = {
      ...searchQuery,
      aggs: newAggs,
    };

    setSearchQuery(newQuery);

    setShowMoreClicked({
      ...showMoreClicked,
      [aggregation]: !showMoreClicked[aggregation],
    });

    props.updateAggs(newQuery);
  }

  const debouncedFilterFacets = React.useMemo(
    () =>
      debounce((value: string) => {
        const filtered = Object.fromEntries(
          Object.entries(props.facet).filter(([facetValueName]) =>
            facetValueName.toLowerCase().includes(value),
          ),
        );
        setFilteredFacets(filtered);
      }, 300),
    [props.facet],
  );

  function inputFilterOnChangeHandler(value: string) {
    debouncedFilterFacets(value);
  }

  return (
    <>
      <CheckboxGroupComponent
        translatedLabel={translateProject(props.labelName)}
        dataLabel={props.labelName}
        value={selected}
        onChange={checkboxChangeHandler}
        sortIconClickHandler={sortIconClickHandler}
        facetLength={facetLength}
        sortOrder={sortOrder}
      >
        <input
          className="ml-2 mr-2 h-8 rounded border border-gray-300 px-2 py-1.5 text-sm"
          onChange={(event) =>
            inputFilterOnChangeHandler(event.currentTarget.value)
          }
          placeholder="Zoek in facet"
        />
        {Object.entries(filteredFacets).map(
          ([facetValueName, facetValueCount], index) => {
            const isSelected = getIsSelected(
              facetValueName,
              props.labelName,
              props.facetName,
              props.selectedFacets,
            );

            const facetOptionKey = `${props.labelName}-${facetValueName}`;
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
                      props.labelName,
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
      {facetLength < 10 ? null : (
        <div>
          {showMoreClicked[props.labelName] ? (
            <ShowLessButton
              showLessButtonClickHandler={() =>
                showMoreButtonClickHandler(props.labelName)
              }
              facetName={props.labelName}
            />
          ) : (
            <ShowMoreButton
              showMoreButtonClickHandler={showMoreButtonClickHandler}
              facetName={props.labelName}
            />
          )}
        </div>
      )}
    </>
  );
}
