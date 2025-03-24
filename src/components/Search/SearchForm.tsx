import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import React from "react";
import type { Key, Selection } from "react-aria-components";
import { toast } from "react-toastify";

import { FacetEntry, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { DateFacet } from "./DateFacet.tsx";
import { FacetFilter } from "./FacetFilter.tsx";
import { FragmenterSelection } from "./FragmenterSelection.tsx";
import { FullTextSearchBar } from "./FullTextSearchBar.tsx";
import { InputFacet } from "./InputFacet.tsx";
import { KeywordFacet } from "./KeywordFacet.tsx";
import { NewSearchButton } from "./NewSearchButton.tsx";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { ShowLessButton } from "./ShowLessButton.tsx";
import { ShowMoreButton } from "./ShowMoreButton.tsx";
import { SliderFacet } from "./SliderFacet.tsx";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";
import { removeTerm } from "./util/removeTerm.ts";
import { sanitizeFullText } from "./util/sanitizeFullText.tsx";

interface SearchFormProps {
  onSearch: (toFirstPage: boolean) => void;
  keywordFacets: FacetEntry[];
  searchQuery: SearchQuery;
  updateAggs: (query: SearchQuery) => void;
}

const searchFormClasses =
  "hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10";

export function SearchForm(props: SearchFormProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isFromDateValid, setIsFromDateValid] = React.useState(true);
  const [isToDateValid, setIsToDateValid] = React.useState(true);

  const [filteredAggs, setFilteredAggs] = React.useState<string[]>([]);
  const [defaultAggsIsInit, setDefaultAggsIsInit] = React.useState(false);
  const translate = useProjectStore(translateSelector);

  const { searchResults } = useSearchStore();
  const { searchQuery, updateSearchQuery, searchParams, updateSearchParams } =
    useUrlSearchParamsStore();

  function onSearch() {
    props.onSearch(true);
  }

  const debouncedOnSearch = React.useCallback(
    debounce(() => {
      onSearch();
    }, 250),
    [],
  );

  React.useEffect(() => {
    if (defaultAggsIsInit) return;

    if (!isEmpty(props.keywordFacets)) {
      const searchQueryTerms = Object.keys(props.searchQuery.terms);
      const defaultKeywordAggs = projectConfig.defaultKeywordAggsToRender;
      const relevantFacetNames = [...defaultKeywordAggs, ...searchQueryTerms];

      const initialFilteredAggs = props.keywordFacets.reduce<string[]>(
        (accumulator, keywordFacet) => {
          if (relevantFacetNames.includes(keywordFacet[0])) {
            accumulator.push(keywordFacet[0]);
          }
          return accumulator;
        },
        [],
      );
      setFilteredAggs(initialFilteredAggs);
      setDefaultAggsIsInit(true);
    }
  }, [props.keywordFacets, projectConfig.defaultKeywordAggsToRender]);

  function updateKeywordFacet(
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
    updateSearchQuery({ terms: newTerms });
    onSearch();
  }

  function updateSliderFacet(newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      updateSearchQuery({
        ...searchQuery,
        rangeFrom: newValue[0].toString(),
        rangeTo: newValue[1].toString(),
      });
      debouncedOnSearch();
    }
  }

  function goToQuery(query: SearchQuery) {
    updateSearchQuery(query);
    onSearch();
  }

  const updateFragmenter = (key: Key) => {
    if (!key) {
      return;
    }
    updateSearchParams({
      fragmentSize: key as number,
    });
    if (searchResults) {
      props.onSearch(false);
    }
  };

  function updateFullText(value: string) {
    updateSearchQuery({ fullText: value });
  }

  function resetDates(update: { dateFrom: string; dateTo: string }) {
    updateSearchQuery({
      ...searchQuery,
      dateFrom: update.dateFrom,
      dateTo: update.dateTo,
    });
    onSearch();
  }

  function fromDateChangeHandler(newFromDate: string, isValid: boolean) {
    setIsFromDateValid(isValid);
    updateSearchQuery({
      ...searchQuery,
      dateFrom: newFromDate,
    });

    if (isValid && isToDateValid) {
      onSearch();
    }
  }

  function toDateChangeHandler(newToDate: string, isValid: boolean) {
    setIsToDateValid(isValid);
    updateSearchQuery({
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

    updateSearchQuery({ terms: newTerms });
    onSearch();
  }

  function inputFacetOnBlurHandler(value: string) {
    const uniqValues = uniq(value.replace(/\s/g, "").split(","));

    const newTerms = {
      [projectConfig.inputFacetOptions]: uniqValues,
    };

    updateSearchQuery({ terms: newTerms });
  }

  function fullTextSearchBarSubmitHandler(value: string) {
    const sanitized = sanitizeFullText(value);
    const isEmptySearch =
      !sanitized.length && !projectConfig.allowEmptyStringSearch;

    if (isEmptySearch) {
      return toast(translate("NO_SEARCH_STRING"), {
        type: "warning",
      });
    }
    updateFullText(sanitized);
    onSearch();
  }

  function fullTextSearchBarOnBlurHandler(value: string) {
    updateFullText(value);
  }

  function showLessMoreButtonClickHandler(
    aggregation: string,
    facetLength: number,
  ) {
    const prevAggs = searchQuery.aggs;
    const defaultFacetLength = 10;
    const maxFacetLength = 9999;

    const newAggs = prevAggs?.map((prevAgg) => {
      if (!prevAgg.facetName.startsWith(aggregation)) return prevAgg;

      const newAgg = {
        ...prevAgg,
        size:
          facetLength > defaultFacetLength
            ? defaultFacetLength
            : maxFacetLength,
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

  function facetFilterChangeHandler(keys: Selection) {
    const updatedFilteredAggs = Array.from(keys) as string[];
    const orderedFilteredAggs = props.keywordFacets
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
            goToQuery={goToQuery}
            projectConfig={projectConfig}
          />
        </div>
      )}

      <div className="w-full max-w-[450px]">
        <FragmenterSelection
          onChange={updateFragmenter}
          value={searchParams.fragmentSize}
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

      {projectConfig.showFacetFilter && props.keywordFacets.length !== 0 && (
        <div className="flex w-full max-w-[450px] flex-col gap-4">
          <FacetFilter
            allPossibleKeywordFacets={props.keywordFacets}
            filteredKeywordFacets={filteredAggs}
            facetFilterChangeHandler={facetFilterChangeHandler}
          />
        </div>
      )}

      {projectConfig.showKeywordFacets &&
        !isEmpty(props.keywordFacets) &&
        filteredAggs.map((facetName, index) => {
          const facetValue = props.keywordFacets.find(
            (facet) => facet[0] === facetName,
          )?.[1];

          return facetValue ? (
            <React.Fragment key={index}>
              <div className="max-h-[500px] w-full max-w-[450px] overflow-y-auto overflow-x-hidden">
                <KeywordFacet
                  facetName={facetName}
                  facet={facetValue}
                  selectedFacets={searchQuery.terms}
                  onChangeKeywordFacet={updateKeywordFacet}
                  onSearch={onSearch}
                  updateAggs={props.updateAggs}
                />
              </div>
              {Object.keys(facetValue).length < 10 ? null : (
                <div key={`btn-${index}`}>
                  {Object.keys(facetValue).length > 10 ? (
                    <ShowLessButton
                      showLessButtonClickHandler={() =>
                        showLessMoreButtonClickHandler(
                          facetName,
                          Object.keys(facetValue).length,
                        )
                      }
                      facetName={facetName}
                    />
                  ) : (
                    <ShowMoreButton
                      showMoreButtonClickHandler={() =>
                        showLessMoreButtonClickHandler(
                          facetName,
                          Object.keys(facetValue).length,
                        )
                      }
                      facetName={facetName}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          ) : null;
        })}
    </div>
  );
}
