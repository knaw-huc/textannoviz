import {Facets, SearchQueryRequestBody} from "../../model/Search.ts";
import {projectConfigSelector, useProjectStore} from "../../stores/project.ts";
import {useSearchParams} from "react-router-dom";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {filterFacetByTypeSelector, searchHistorySelector} from "../../stores/search/search-query-slice.ts";
import {removeTerm} from "./util/removeTerm.ts";
import {QUERY} from "./SearchUrlParams.ts";
import {Base64} from "js-base64";
import {ChangeEvent} from "react";
import {FullTextSearchBar} from "./FullTextSearchBar.tsx";
import {NewSearchButton} from "./NewSearchButton.tsx";
import {SearchQueryHistory} from "./SearchQueryHistory.tsx";
import {Fragmenter} from "./Fragmenter.tsx";
import {DateFacet} from "./DateFacet.tsx";
import * as _ from "lodash";
import {KeywordFacet} from "./KeywordFacet.tsx";

const searchFormClasses = "hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10";

export function SearchForm(props: {
  setDirty: (dirty: boolean) => void,
  facets: Facets
}) {
  const {
    facets,
    setDirty
  } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const queryHistory = useSearchStore(searchHistorySelector);
  const filterFacetsByType = useSearchStore(filterFacetByTypeSelector);
  const setUrlParams = useSearchParams()[1];
  const {
    searchUrlParams, setSearchUrlParams,
    searchQuery, setSearchQuery,
    searchResult
  } = useSearchStore();

  function updateSelectedKeywordFacet(
      facetName: string,
      facetOptionName: string,
      selected: boolean,
  ) {
    const newTerms = {...searchQuery.terms};
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
    setSearchQuery({...searchQuery, terms: newTerms});
    setSearchUrlParams({...searchUrlParams, from: 0});
    setDirty(true);
  }

  function goToQuery(query: SearchQueryRequestBody) {
    setUrlParams(searchParams => {
      searchParams.set(QUERY, Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
  }

  const updateFragmenter = (
      event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      fragmenter: event.currentTarget.value
    });
  };

  return <div className={searchFormClasses}>
    <FullTextSearchBar
        fullText={searchQuery.fullText}
        onSubmit={() => setDirty(true)}
        updateFullText={(value) => setSearchQuery({...searchQuery, fullText: value})}
    />

    {searchResult && (
        <NewSearchButton/>
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
      <Fragmenter
          onChange={updateFragmenter}
          value={searchUrlParams.fragmenter}
      />
    </div>

    {projectConfig.showDateFacets && (
        filterFacetsByType(facets, "date").map((_, index) => <DateFacet
            key={index}
            dateFrom={searchQuery.dateFrom}
            dateTo={searchQuery.dateTo}
            changeDateTo={update => setSearchQuery({...searchQuery, dateTo: update})}
            changeDateFrom={update => setSearchQuery({...searchQuery, dateFrom: update})}
        />)
    )}

    {projectConfig.showKeywordFacets && !_.isEmpty(facets) && (
        filterFacetsByType(facets, "keyword").map(([facetName, facetValue], index) => (
            <KeywordFacet
                key={index}
                facetName={facetName}
                facet={facetValue}
                selectedFacets={searchQuery.terms}
                onChangeKeywordFacet={updateSelectedKeywordFacet}
            />
        ))
    )}
  </div>
}