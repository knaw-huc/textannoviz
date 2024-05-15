import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import React from "react";
import type { Key } from "react-aria-components";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  FacetEntry,
  SearchQuery,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { DateFacet } from "./DateFacet.tsx";
import { FragmenterSelection } from "./FragmenterSelection.tsx";
import { FullTextSearchBar } from "./FullTextSearchBar.tsx";
import { InputFacet } from "./InputFacet.tsx";
import { KeywordFacet } from "./KeywordFacet.tsx";
import { NewSearchButton } from "./NewSearchButton.tsx";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { SliderFacet } from "./SliderFacet.tsx";
import { removeTerm } from "./util/removeTerm.ts";

interface SearchFormProps {
  onSearch: (stayOnPage?: boolean) => void;
  keywordFacets: FacetEntry[];
}

const searchFormClasses =
  "hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10";

export function SearchForm(props: SearchFormProps) {
  const { keywordFacets, onSearch } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const queryHistory = useSearchStore((state) => state.searchQueryHistory);
  const [isFromDateValid, setIsFromDateValid] = React.useState(true);
  const [isToDateValid, setIsToDateValid] = React.useState(true);

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
    const newTerms = {
      [projectConfig.inputFacetOptions]: value.split(","),
    };

    setSearchQuery({
      ...searchQuery,
      terms: newTerms,
    });

    onSearch();
  }

  return (
    <div className={searchFormClasses}>
      <div className="w-full max-w-[450px]">
        <FullTextSearchBar
          key={searchQuery.fullText}
          fullText={searchQuery.fullText}
          onSubmit={(newFullText) => {
            updateFullText(newFullText);
            onSearch();
          }}
        />
      </div>

      {projectConfig.showInputFacet && (
        <div className="w-full max-w-[450px]">
          <InputFacet
            onSubmit={inputFacetOnSubmitHandler}
            key={searchQuery.terms[projectConfig.inputFacetOptions]?.toString()}
            inputValue={
              searchQuery.terms[
                projectConfig.inputFacetOptions
              ]?.toString() ?? [""]
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

      {projectConfig.showKeywordFacets &&
        !isEmpty(keywordFacets) &&
        props.keywordFacets.map(([facetName, facetValue], i) => (
          <div key={i} className="w-full max-w-[450px]">
            <KeywordFacet
              facetName={facetName}
              facet={facetValue}
              selectedFacets={searchQuery.terms}
              onChangeKeywordFacet={updateKeywordFacet}
            />
          </div>
        ))}
    </div>
  );
}
