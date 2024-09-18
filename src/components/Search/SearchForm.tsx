import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import React from "react";
import type { Key, Selection } from "react-aria-components";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  FacetEntry,
  SearchQuery,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { CheckboxFacet } from "./CheckboxFacet.tsx";
import { DateFacet } from "./DateFacet.tsx";
import { FacetFilter } from "./FacetFilter.tsx";
import { FragmenterSelection } from "./FragmenterSelection.tsx";
import { FullTextSearchBar } from "./FullTextSearchBar.tsx";
import { InputFacet } from "./InputFacet.tsx";
import { NewSearchButton } from "./NewSearchButton.tsx";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { ShowLessButton } from "./ShowLessButton.tsx";
import { ShowMoreButton } from "./ShowMoreButton.tsx";
import { SliderFacet } from "./SliderFacet.tsx";
import { removeTerm } from "./util/removeTerm.ts";

interface SearchFormProps {
  onSearch: () => void;
  checkboxFacets: FacetEntry[];
  updateAggs: (query: SearchQuery) => void;
}

type ShowMoreClickedState = Record<string, boolean>;

const searchFormClasses =
  "hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10";

export function SearchForm(props: SearchFormProps) {
  const { onSearch } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const queryHistory = useSearchStore((state) => state.searchQueryHistory);
  const [isFromDateValid, setIsFromDateValid] = React.useState(true);
  const [isToDateValid, setIsToDateValid] = React.useState(true);
  const [showMoreClicked, setShowMoreClicked] =
    React.useState<ShowMoreClickedState>({});
  const [filteredAggs, setFilteredAggs] = React.useState<string[]>([]);
  const [defaultAggsIsInit, setDefaultAggsIsInit] = React.useState(false);

  const {
    searchUrlParams,
    setSearchUrlParams,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useSearchStore();

  const debouncedOnSearch = React.useCallback(
    debounce(() => {
      onSearch();
    }, 250),
    [],
  );

  React.useEffect(() => {
    if (defaultAggsIsInit) return;
    if (!isEmpty(props.checkboxFacets)) {
      const initialFilteredAggs = props.checkboxFacets.reduce<string[]>(
        (accumulator, checkboxFacet) => {
          if (
            projectConfig.defaultCheckboxAggsToRender.includes(checkboxFacet[0])
          ) {
            accumulator.push(checkboxFacet[0]);
          }
          return accumulator;
        },
        [],
      );
      setDefaultAggsIsInit(true);
      setFilteredAggs(initialFilteredAggs);
    }
  }, [props.checkboxFacets, projectConfig.defaultCheckboxAggsToRender]);

  function updateCheckboxFacet(
    facetName: string,
    facetOptionName: string,
    selected: boolean,
  ) {
    const newTerms = { ...searchQuery.terms };
    if (!selected) {
      removeTerm(newTerms, facetName, facetOptionName);
    } else {
      const facet = newTerms[facetName];
      if (facet) {
        facet.push(facetOptionName);
      } else {
        newTerms[facetName] = [facetOptionName];
      }
    }
    setSearchQuery({ ...searchQuery, terms: newTerms });
    onSearch();
  }

  function updateSliderFacet(newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      setSearchQuery({
        ...searchQuery,
        rangeFrom: newValue[0].toString(),
        rangeTo: newValue[1].toString(),
      });
      debouncedOnSearch();
    }
  }

  function goToQuery(query: SearchQuery) {
    setSearchQuery(query);
    onSearch();
  }

  const updateFragmenter = (key: Key) => {
    if (!key) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      fragmentSize: key as number,
    });
    if (searchResults) {
      onSearch();
    }
  };

  function updateFullText(value: string) {
    setSearchQuery({ ...searchQuery, fullText: value });
  }

  function resetDates(update: { dateFrom: string; dateTo: string }) {
    setSearchQuery({
      ...searchQuery,
      dateFrom: update.dateFrom,
      dateTo: update.dateTo,
    });
    onSearch();
  }

  function fromDateChangeHandler(newFromDate: string, isValid: boolean) {
    setIsFromDateValid(isValid);
    setSearchQuery({
      ...searchQuery,
      dateFrom: newFromDate,
    });

    if (isValid && isToDateValid) {
      onSearch();
    }
  }

  function toDateChangeHandler(newToDate: string, isValid: boolean) {
    setIsToDateValid(isValid);
    setSearchQuery({
      ...searchQuery,
      dateTo: newToDate,
    });

    if (isValid && isFromDateValid) {
      onSearch();
    }
  }

  function inputFacetOnSubmitHandler(value: string) {
    const uniqValues = uniq(value.replace(/\s/g, "").split(","));

    const newTerms = {
      [projectConfig.inputFacetOptions]: uniqValues,
    };

    setSearchQuery({
      ...searchQuery,
      terms: newTerms,
    });
    onSearch();
  }

  function inputFacetOnBlurHandler(value: string) {
    const uniqValues = uniq(value.replace(/\s/g, "").split(","));

    const newTerms = {
      [projectConfig.inputFacetOptions]: uniqValues,
    };

    setSearchQuery({
      ...searchQuery,
      terms: newTerms,
    });
  }

  function fullTextSearchBarSubmitHandler(value: string) {
    const sanitisedValue = value.trim();
    updateFullText(sanitisedValue);
    onSearch();
  }

  function fullTextSearchBarOnBlurHandler(value: string) {
    updateFullText(value);
  }

  function showMoreButtonClickHandler(aggregation: string) {
    const prevAggs = searchQuery.aggs;

    const newAggs = prevAggs?.map((prevAgg) => {
      if (!prevAgg.facetName.startsWith(aggregation)) return prevAgg;

      const newAgg = {
        ...prevAgg,
        size: showMoreClicked[aggregation] ? 10 : 1000,
      };

      return newAgg;
    });

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

  function facetFilterChangeHandler(keys: Selection) {
    const updatedFilteredAggs = Array.from(keys) as string[];
    const orderedFilteredAggs = props.checkboxFacets
      .map((facet) => facet[0])
      .filter((facetName) => updatedFilteredAggs.includes(facetName));
    setFilteredAggs(orderedFilteredAggs);
  }

  return (
    <div className={searchFormClasses}>
      <div className="w-full max-w-[450px]">
        <FullTextSearchBar
          key={searchQuery.fullText}
          fullText={searchQuery.fullText}
          onSubmit={fullTextSearchBarSubmitHandler}
          onBlur={fullTextSearchBarOnBlurHandler}
        />
      </div>

      {projectConfig.showInputFacet && (
        <div className="w-full max-w-[450px]">
          <InputFacet
            onSubmit={inputFacetOnSubmitHandler}
            onBlur={inputFacetOnBlurHandler}
            key={searchQuery.terms[projectConfig.inputFacetOptions]?.toString()}
            inputValue={
              searchQuery.terms[projectConfig.inputFacetOptions]?.toString() ??
              ""
            }
          />
        </div>
      )}

      {searchResults && projectConfig.showNewSearchButton && (
        <NewSearchButton />
      )}

      {projectConfig.showSearchQueryHistory && (
        <div className="w-full max-w-[450px]">
          <SearchQueryHistory
            queryHistory={queryHistory}
            goToQuery={goToQuery}
            projectConfig={projectConfig}
            disabled={!queryHistory.length}
          />
        </div>
      )}

      <div className="w-full max-w-[450px]">
        <FragmenterSelection
          onChange={updateFragmenter}
          value={searchUrlParams.fragmentSize}
        />
      </div>

      {projectConfig.showDateFacets && searchQuery.dateFacet && (
        <DateFacet
          dateFrom={searchQuery.dateFrom}
          dateTo={searchQuery.dateTo}
          resetDates={resetDates}
          fromDateChangeHandler={fromDateChangeHandler}
          toDateChangeHandler={toDateChangeHandler}
        />
      )}

      {projectConfig.showSliderFacets && (
        <SliderFacet
          initialValue={[
            parseInt(projectConfig.initialRangeFrom),
            parseInt(projectConfig.initialRangeTo),
          ]}
          maxValue={projectConfig.maxRange}
          onChange={updateSliderFacet}
          thumbLabels={["start", "end"]}
        />
      )}

      {projectConfig.showFacetFilter && props.checkboxFacets.length !== 0 && (
        <div className="flex w-full max-w-[450px] flex-col gap-4">
          <FacetFilter
            allPossibleCheckboxFacets={props.checkboxFacets}
            filteredCheckboxFacets={filteredAggs}
            facetFilterChangeHandler={facetFilterChangeHandler}
          />
        </div>
      )}
      {/* keyword facetten ombouwen in checkbox facetten? Dat is dan een combi van keyword en nested facetten. Daar dan overheen lopen */}
      {projectConfig.showCheckboxFacets &&
        !isEmpty(props.checkboxFacets) &&
        filteredAggs.map((facetName, index) => {
          const facetValue = props.checkboxFacets.find(
            (facet) => facet[0] === facetName,
          )?.[1];

          return facetValue ? (
            <>
              <div
                key={index}
                className="max-h-[500px] w-full max-w-[450px] overflow-y-auto overflow-x-hidden"
              >
                <CheckboxFacet
                  facetName={facetName}
                  facet={facetValue}
                  selectedFacets={searchQuery.terms}
                  onChangeCheckboxFacet={updateCheckboxFacet}
                  onSearch={props.onSearch}
                  updateAggs={props.updateAggs}
                />
              </div>
              {Object.keys(facetValue).length < 10 ? null : (
                <div key={`btn-${index}`}>
                  {showMoreClicked[facetName] ? (
                    <ShowLessButton
                      showLessButtonClickHandler={() =>
                        showMoreButtonClickHandler(facetName)
                      }
                      facetName={facetName}
                    />
                  ) : (
                    <ShowMoreButton
                      showMoreButtonClickHandler={showMoreButtonClickHandler}
                      facetName={facetName}
                    />
                  )}
                </div>
              )}
            </>
          ) : null;
        })}
    </div>
  );
}
