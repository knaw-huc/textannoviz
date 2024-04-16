import isEmpty from "lodash/isEmpty";
import React from "react";
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
import { KeywordFacet } from "./KeywordFacet.tsx";
import { NewSearchButton } from "./NewSearchButton.tsx";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { SliderFacet } from "./SliderFacet.tsx";
import { removeTerm } from "./util/removeTerm.ts";

type SearchFormProps = {
  onSearch: (stayOnPage?: boolean) => void;
  keywordFacets: FacetEntry[];
};

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
    _.debounce(() => {
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
    const newTerms = { ...searchQuery.terms };
    newTerms["wordCount"] = [newValue.toString()];
    setSearchQuery({ ...searchQuery, terms: newTerms });
    debouncedOnSearch();
  }

  function goToQuery(query: SearchQuery) {
    setSearchQuery(query);
    onSearch();
  }

  const updateFragmenter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      fragmentSize: parseInt(event.currentTarget.value),
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

  return (
    <div className={searchFormClasses}>
      <FullTextSearchBar
        key={searchQuery.fullText}
        fullText={searchQuery.fullText}
        onSubmit={(newFullText) => {
          updateFullText(newFullText);
          onSearch();
        }}
      />

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
          defaultValue={500}
          maxValue={3000}
          onChange={updateSliderFacet}
        />
      )}

      {projectConfig.showKeywordFacets &&
        !isEmpty(keywordFacets) &&
        props.keywordFacets.map(([facetName, facetValue], i) => (
          <KeywordFacet
            key={i}
            facetName={facetName}
            facet={facetValue}
            selectedFacets={searchQuery.terms}
            onChangeKeywordFacet={updateKeywordFacet}
          />
        ))}
    </div>
  );
}
