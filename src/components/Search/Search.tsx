import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import React from "react";
import { Button } from "react-aria-components";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  FacetValue,
  Facets,
  Indices,
  SearchQuery,
  SearchResult,
} from "../../model/Search";
import { useSearchStore } from "../../stores/search";
import { sendSearchQuery } from "../../utils/broccoli";
import { Fragmenter } from "./Fragmenter";
import { KeywordFacet } from "./KeywordFacet";
import { SearchItem } from "./SearchItem";
import { SearchPagination } from "./SearchPagination";
import { SearchResultsPerPage } from "./SearchResultsPerPage";
import { SearchSortBy } from "./SearchSortBy";

type SearchProps = {
  project: string;
  projectConfig: ProjectConfig;
  indices: Indices;
  facets: Facets;
  indexName: string;
  searchFacetTitles: Record<string, string>;
};

export const Search = (props: SearchProps) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState(
    props.projectConfig.initialDateFrom ?? "",
  );
  const [dateTo, setDateTo] = React.useState(
    props.projectConfig.initialDateTo ?? "",
  );
  const [facets, setFacets] = React.useState<Facets>(props.facets);
  const [query, setQuery] = React.useState<SearchQuery>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("_score");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [internalSortValue, setInternalSortValue] = React.useState("_score");
  const [fullText, setFullText] = React.useState("");
  const [dirty, setDirty] = React.useState(0);
  const [checkboxStates, setCheckBoxStates] = React.useState(
    new Map<string, boolean>(),
  );
  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([]);
  const [historyIsOpen, setHistoryIsOpen] = React.useState(false);
  const [includeDate, setIncludeDate] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const setGlobalSearchResults = useSearchStore(
    (state) => state.setGlobalSearchResults,
  );
  const setGlobalSearchQuery = useSearchStore(
    (state) => state.setGlobalSearchQuery,
  );
  const setTextToHighlight = useSearchStore(
    (state) => state.setTextToHighlight,
  );

  React.useEffect(() => {
    const queryEncoded = searchParams.get("query");
    const queryDecoded: SearchQuery =
      queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));

    if (queryDecoded) {
      if (queryDecoded.text) {
        setFullText(queryDecoded.text);
      }
    }
    const newMap = new Map<string, boolean>();
    const selectedFacets: string[] = [];

    if (queryDecoded) {
      Object.entries(queryDecoded.terms).forEach(([facetName, facetValues]) => {
        facetValues.forEach((facetValue) => {
          const key = `${facetName}-${facetValue}`;
          selectedFacets.push(key);
        });
      });
    }

    getKeywordFacets().map(([facetName, facetValues]) => {
      Object.keys(facetValues).forEach((facetValueName) => {
        const key = `${facetName}-${facetValueName}`;
        newMap.set(key, false);
        if (selectedFacets.includes(key)) {
          newMap.set(key, true);
        }
      });
    });
    setCheckBoxStates(newMap);
  }, [props.facets, props.indices, searchParams]);

  React.useEffect(() => {
    async function search(
      query: SearchQuery,
      frag: string,
      size: string,
      from: number,
      sortBy: string,
      sortOrder: string,
      page: string,
    ) {
      const maxSize = 100;
      const limitedSize = Math.min(parseInt(size), maxSize);
      const data = await sendSearchQuery(
        query,
        frag,
        limitedSize,
        from,
        props.projectConfig,
        sortBy,
        sortOrder,
      );

      setSearchResults(data);
      setGlobalSearchResults(data);
      const toHighlight = getTextToHighlight(data);
      setTextToHighlight(toHighlight);
      setElasticFrom(from);
      setPageNumber(parseInt(page));
      setElasticSize(limitedSize);
      setSortBy(sortBy);
      setSortOrder(sortOrder);
      setFacets(data.aggs);
      setQuery(query);
      setGlobalSearchQuery(query);
      setFragmenter(frag);
      if (query.date) {
        setDateFrom(query.date?.from);
        setDateTo(query.date?.to);
      }

      if (sortBy === "_score") {
        setInternalSortValue("_score");
      }
      if (sortBy === "sessionDate") {
        if (sortOrder === "desc") {
          setInternalSortValue("dateDesc");
        }
        if (sortOrder === "asc") {
          setInternalSortValue("dateAsc");
        }
      }
      if (parseInt(size) > maxSize)
        toast("Please don't :). Max results per page is limited to 100.", {
          type: "warning",
        });
      setSearchParams((searchParams) => {
        searchParams.set("size", limitedSize.toString());
        return searchParams;
      });
    }

    if ([...searchParams.keys()].length > 0) {
      const page = searchParams.get("page");
      const size = searchParams.get("size");
      const from =
        parseInt(page ?? "1") * parseInt(size ?? "10") - parseInt(size ?? "10");
      const frag = searchParams.get("frag");
      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");
      const queryEncoded = searchParams.get("query");
      const queryDecoded: SearchQuery =
        queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
      search(
        queryDecoded,
        frag ?? "",
        size ?? "",
        from,
        sortBy ?? "",
        sortOrder ?? "",
        page ?? "",
      );
    }
  }, [props.projectConfig, searchParams]);

  function getTextToHighlight(data: SearchResult) {
    const regex = new RegExp(/<em>(.*?)<\/em>/g);

    const newMap = new Map<string, string[]>();

    data?.results.forEach((result) => {
      const previews: string[] = [];
      result._hits?.forEach((hit) => {
        const regexedString = hit.preview
          .match(regex)
          ?.map((str) => str.substring(4, str.length - 5));
        if (regexedString) {
          previews.push(...new Set(regexedString));
        }
      });
      newMap.set(result._id, [...new Set(previews)]);
    });

    return newMap;
  }

  function refresh() {
    setDirty((prev) => prev + 1);
  }

  const doSearch = async () => {
    const searchQuery: SearchQuery = {
      terms: {},
    };

    if (fullText) {
      if (fullText.charAt(fullText.length - 1).includes("\\")) {
        toast("Please remove the trailing backslash from your search query.", {
          type: "error",
        });
        return;
      }
      searchQuery["text"] = fullText;
    }

    getKeywordFacets().map(([facetName, facetValues]) => {
      Object.keys(facetValues as FacetValue).map((facetValueName) => {
        const key = `${facetName}-${facetValueName}`;
        if (checkboxStates.get(key)) {
          if (searchQuery["terms"][facetName]) {
            searchQuery["terms"][facetName].push(facetValueName);
          } else {
            searchQuery["terms"][facetName] = [facetValueName];
          }
        }
      });
    });

    if (includeDate) {
      getDateFacets().map(([facetName]) => {
        searchQuery["date"] = {
          name: facetName,
          from: dateFrom,
          to: dateTo,
        };
      });
    }

    if (!fullText && Object.keys(searchQuery.terms).length === 0) {
      toast("Please select a facet or use the full text search.", {
        type: "info",
      });
      return;
    }

    setQuery(searchQuery);
    console.log(searchQuery);
    setQueryHistory([searchQuery, ...queryHistory]);
    setGlobalSearchQuery(searchQuery);

    const data = await sendSearchQuery(
      searchQuery,
      fragmenter,
      elasticSize,
      0,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const page = 1;

    setSearchResults(data);
    setGlobalSearchResults(data);

    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);

    setElasticFrom(0);
    setPageNumber(page);
    setFacets(data.aggs);
    setSearchParams({
      page: page.toString(),
      size: elasticSize.toString(),
      frag: fragmenter,
      sortBy: sortBy,
      sortOrder: sortOrder,
      query: Base64.toBase64(JSON.stringify(searchQuery)),
    });
  };

  const handleFullTextFacet = (value: string) => {
    setFullText(value);
  };

  const fullTextEnterPressedHandler = (pressed: boolean) => {
    if (pressed) {
      refresh();
    }
  };

  const fragmenterSelectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    setFragmenter(event.currentTarget.value);

    if (searchResults) {
      setSearchParams((searchParams) => {
        searchParams.set("frag", event.currentTarget.value);
        return searchParams;
      });
    }
  };

  async function prevPageClickHandler() {
    if (pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    const newFrom = elasticFrom - elasticSize;
    setElasticFrom((prevFrom) => prevFrom - elasticSize);
    setPageNumber(prevPage);

    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      newFrom,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setSearchResults(data);
    setGlobalSearchResults(data);
    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);
    setSearchParams((searchParams) => {
      searchParams.set("page", prevPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  async function nextPageClickHandler() {
    const newFrom = elasticFrom + elasticSize;
    if (searchResults && searchResults.total.value <= newFrom) return;
    const nextPage = pageNumber + 1;
    setElasticFrom(newFrom);
    setPageNumber(nextPage);
    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      newFrom,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setSearchResults(data);
    setGlobalSearchResults(data);
    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);
    setSearchParams((searchParams) => {
      searchParams.set("page", nextPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  const resultsPerPageSelectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    setElasticSize(parseInt(event.currentTarget.value));

    setSearchParams((searchParams) => {
      searchParams.set("size", event.currentTarget.value);
      return searchParams;
    });
  };

  async function jumpToPageHandler(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const newFrom = (parseInt(event.currentTarget.value) - 1) * elasticSize;
    setElasticFrom(newFrom);
    setPageNumber(parseInt(event.currentTarget.value));
    setSearchParams((searchParams) => {
      searchParams.set("page", event.currentTarget.value);
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    if (dirty > 0) {
      doSearch();
    }
  }, [dirty]);

  function getFacets(type: string) {
    return Object.entries(facets).filter(([key]) => {
      return props.indices[props.indexName][key] === type;
    });
  }

  function getKeywordFacets() {
    return getFacets("keyword");
  }

  function getDateFacets() {
    return getFacets("date");
  }

  function sortByChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value;

    let sortByValue = "_score";
    let sortOrderValue = "desc";

    if (getDateFacets() && getDateFacets()[0]) {
      const facetName = getDateFacets()[0][0];

      if (selectedValue === "dateAsc" || selectedValue === "dateDesc") {
        sortByValue = facetName;
        sortOrderValue = selectedValue === "dateAsc" ? "asc" : "desc";
      }
    } else {
      toast(
        "Sorting on date is not possible with the current search results.",
        { type: "info" },
      );
    }

    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setInternalSortValue(selectedValue);

    setSearchParams((searchParams) => {
      searchParams.set("sortBy", sortByValue);
      searchParams.set("sortOrder", sortOrderValue);
      return searchParams;
    });
  }

  function renderKeywordFacets() {
    return (
      <KeywordFacet
        getKeywordFacets={getKeywordFacets}
        keywordFacetChangeHandler={keywordFacetChangeHandler}
        searchFacetTitles={props.searchFacetTitles}
        projectConfig={props.projectConfig}
        checkboxStates={checkboxStates}
      />
    );
  }

  function renderDateFacets() {
    return getDateFacets().map(([facetName], index) => {
      return (
        <div
          key={index}
          className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row"
        >
          <div className="flex w-full flex-col">
            <div className="flex items-center"></div>
            <label htmlFor="start" className="font-semibold">
              Van
            </label>
            <input
              className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
              type="date"
              id="start"
              value={dateFrom}
              min={props.projectConfig.initialDateFrom}
              max={props.projectConfig.initialDateTo}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </div>
          <div className="flex w-full flex-col">
            <label htmlFor="end" className="font-semibold">
              Tot en met
            </label>
            <input
              className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
              type="date"
              id="end"
              value={dateTo}
              min={props.projectConfig.initialDateFrom}
              max={props.projectConfig.initialDateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </div>
        </div>
      );
    });
  }

  function removeFacet(key: string) {
    setCheckBoxStates(new Map(checkboxStates.set(key, false)));
    if (searchResults) {
      refresh();
    }
  }

  function keywordFacetChangeHandler(
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCheckBoxStates(new Map(checkboxStates.set(key, event.target.checked)));
    if (searchResults) {
      refresh();
    }
  }

  function historyClickHandler() {
    setHistoryIsOpen(!historyIsOpen);
  }

  function goToQuery(query: SearchQuery) {
    setSearchParams((searchParams) => {
      searchParams.set("query", Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
  }

  return (
    <div
      id="searchContainer"
      className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
    >
      <div className="hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10">
        <div className="w-full max-w-[450px]">
          <label htmlFor="fullText" className="font-semibold">
            Full text search
          </label>
          <div className="flex w-full flex-row">
            <FullTextFacet
              valueHandler={handleFullTextFacet}
              enterPressedHandler={fullTextEnterPressedHandler}
              value={fullText}
              className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
              placeholder="Press ENTER to search"
            />
            <Button
              className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
              aria-label="Click to search"
              onPress={() => refresh()}
            >
              <MagnifyingGlassIcon className="h-4 w-4 fill-white" />
            </Button>
          </div>
        </div>
        {searchResults ? (
          <div className="w-full max-w-[450px]">
            <Link
              to="/"
              reloadDocument
              className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm no-underline"
            >
              New search query
            </Link>
          </div>
        ) : null}
        {/* <div className="w-full max-w-[450px]">
          <SearchQueryHistory
            historyClickHandler={historyClickHandler}
            historyIsOpen={historyIsOpen}
            queryHistory={queryHistory}
            goToQuery={goToQuery}
            projectConfig={props.projectConfig}
            disabled={queryHistory.length === 0 ? true : false}
          />
        </div> */}
        <div className="w-full max-w-[450px]">
          <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter} />
        </div>
        {/* <div className="w-full max-w-[450px]">
          <Switch
            onChange={() => setIncludeDate(!includeDate)}
            isSelected={includeDate}
          >
            <div className="indicator" />
            <p>Date facet in query</p>
          </Switch>
        </div> */}
        {/* {includeDate ? renderDateFacets() : null}
        {checkboxStates.size > 0 && renderKeywordFacets()} */}
      </div>

      <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
        {searchResults ? (
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {searchResults &&
                `${elasticFrom + 1}-${Math.min(
                  elasticFrom + elasticSize,
                  searchResults.total.value,
                )} of ${searchResults.total.value} results`}
            </span>
            <div className="flex items-center justify-between gap-10">
              {props.projectConfig.showSearchSortBy ? (
                <SearchSortBy
                  onChange={sortByChangeHandler}
                  value={internalSortValue}
                />
              ) : null}

              <SearchResultsPerPage
                onChange={resultsPerPageSelectHandler}
                value={elasticSize}
              />
            </div>
          </div>
        ) : null}
        {searchResults ? (
          <div className="border-brand1Grey-100 -mx-10 mb-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10">
            {/* <span className="text-brand1Grey-600 text-sm">Filters: </span>
            {getKeywordFacets().map(([facetName, facetValues]) => {
              return Object.keys(facetValues).map((facetValueName, index) => {
                const key = `${facetName}-${facetValueName}`;

                if (checkboxStates.get(key)) {
                  return (
                    <div
                      className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
                      key={index}
                    >
                      {(props.projectConfig.searchFacetTitles &&
                        props.projectConfig.searchFacetTitles[facetName]) ??
                        facetName}
                      :{" "}
                      {/^[a-z]/.test(facetValueName)
                        ? facetValueName.charAt(0).toUpperCase() +
                          facetValueName.slice(1)
                        : (facetValueName &&
                            props.projectConfig.facetsTranslation &&
                            props.projectConfig.facetsTranslation[
                              facetValueName
                            ]) ??
                          facetValueName}{" "}
                      {
                        <XMarkIcon
                          className="h-5 w-5"
                          onClick={() => removeFacet(key)}
                        />
                      }
                    </div>
                  );
                }
              });
            })} */}
            <SearchPagination
              prevPageClickHandler={prevPageClickHandler}
              nextPageClickHandler={nextPageClickHandler}
              pageNumber={pageNumber}
              searchResults={searchResults}
              elasticSize={elasticSize}
            />
          </div>
        ) : null}
        {searchResults && searchResults.results.length >= 1 ? (
          searchResults.results.map((result, index) => (
            <SearchItem key={index} result={result} />
          ))
        ) : (
          <>
            <h3 className="">Search Tips:</h3>

            <h4>Keywords</h4>

            <p className="mb-4 mt-4 block">
              The search engine searches for the exact term you entered anywhere
              in the text corpus. For example:{" "}
              <code className=" bg-gray-300">schijp</code> -{">"} will show you
              all pages which include this exact search term.
            </p>

            <p className="mb-4 mt-4 block">
              Note that keyword searches are not case sensitive. For example,{" "}
              <code className=" bg-gray-300">admiraal</code> and{" "}
              <code className=" bg-gray-300">Admiraal</code> will produce the
              same results.
            </p>

            <h4>Multiple Keywords</h4>

            <p className="mb-4 mt-4 block">
              If you enter two or more search terms next to each other, the
              search engine finds the occurrence of either one or both terms in
              the text corpus. For example: {'"swarte peper"'} -{">"} This will
              show you all pages with {'"swarte"'} and/or {'"peper"'}.
            </p>

            <h4>Combining and Excluding Keywords</h4>

            <p className="mb-4 mt-4 block">
              If you add (in uppercase letters) the operators AND or OR between
              your keywords, the search engine will find all occurrences in the
              text corpus that contain all the keywords or else, any one of the
              keywords.
            </p>

            <p className="mb-4 mt-4 block">
              For example: {'"swarte AND peper"'} -{">"} will only show pages
              that include both {'"swarte"'} and {'"peper"'}. Similarly,{" "}
              {'"swarte OR peper"'} -{">"} will show all pages that include one
              or the other. Note that this is different from just entering{" "}
              {'"swarte peper"'} -{">"} as we saw above, this will also list
              pages that included both search terms.
            </p>

            <p className="mb-4 mt-4 block">
              If you wish to search for a keyword but exclude another one, you
              can do this using NOT. For example, {'"engelse NOT oorlog"'} -
              {">"} will find all pages that include {'"engelse"'} but only if
              these do not also include {'"oorlog"'}.
            </p>

            <h4>Expanding your Keywords</h4>

            <p className="mb-4 mt-4 block">
              With the use of special wildcard characters (* and ?) you can
              expand your keyword search to include variants of your search
              term. This can be applied to single words or phrases.
            </p>

            <p className="mb-4 mt-4 block">
              For example, {'"schijp*"'} -{">"} will not just find pages with
              the word {'"schijp"'} but also pages with the words {'"schijpe"'},{" "}
              {'"schijpen"'} and {'"schijpende"'}. More precisely, it will find
              any word that begins with the letters {'"schijp"'}.
            </p>

            <p className="mb-4 mt-4 block">
              You can also use this wildcard to search for a specific word
              preceded or followed by any other word. For example,{" "}
              {'"* schijpen"'} -{">"} would find pages with the words{" "}
              {'"voorbijlaten schijpen"'}, {'"geen schijpen"'} and{" "}
              {'"oorlog schijpen"'}.
            </p>

            <p className="mb-4 mt-4 block">
              If you wish to expand your keyword by just a single character, you
              can use the ? wildcard. For example: {'"cop?e"'} -{">"} will show
              pages with {'"copie"'}, but also with {'"copye"'}. It will not,
              however, show results with {'"coppere"'} since this requires more
              than one character to substitute for the ? wildcard.
            </p>

            <p className="mb-4 mt-4 block">
              You can also combine several query words, for example{" "}
              {'"noodsa??kel??ckheyt"'} to find {'"noodsaackelyckheyt"'} and{" "}
              {'"noodsaackelijckheyt"'} and {'"noodsaackelijckheyt"'}. These
              three words can also be found more simply with {'"noodsa*"'} or,
              if the number of search results is too large, with{" "}
              {'"noodsa*kel*"'}.
            </p>

            <h4>Exact Phrases</h4>

            <p className="mb-4 mt-4 block">
              Placing several search terms, such as a phrase, in double quotes{" "}
              will find the places in the text corpus where that exact phrase
              occurs. For example: {'"copije met de bijlage geteekend"'} -{">"}{" "}
              will find the phrase {'"copije met de bijlage geteekend"'} in the
              text corpus, but not pages with {'"copije geteekend"'}.
            </p>

            <h4>Keyword variants</h4>

            <p className="mb-4 mt-4 block">
              If you want to look for multiple variants of a keyword (for
              example, different spellings) but {"don't"} know or {"don't"} wish
              to specify where the changes in the keyword occur, you can use a
              wildcard (~) that determines how many changes (additions,
              deletions, or substitutions) can occur in the keyword. This
              wildcard, followed by a number, allows you to search for keywords
              that contain a certain number of character changes (‘edit
              distance’).
            </p>

            <p className="mb-4 mt-4 block">
              For example: {'"voorschreven~1"'} -{">"} will find{" "}
              {'"voorschreven"'}, {'"voorschreve"'}, {'"voorschteven"'},{" "}
              {'"veorschreven"'} but not {'"veorschreve"'} because this differs
              from {'"voorschreven"'} by two characters (the {'"e"'} and the
              missing ending {'"-n"'}).
            </p>

            <p className="mb-4 mt-4 block">
              Note that the changed characters can occur anywhere in the
              keyword. For example, {'"suiker~1"'} -{">"} will find {'"sucker"'}
              , {'"suider"'} and {'"zuiker"'}.
            </p>

            <h4>Combining multiple search terms</h4>

            <p className="mb-4 mt-4 block">
              It is possible to combine several search queries with any
              combination of AND, OR and NOT operators. When doing so, you can
              use round brackets to separate search queries.
            </p>

            <p className="mb-4 mt-4 block">
              For example: {'"trader OR merchant OR koopluyden OR schipper"'} -
              {">"} You get results in which any one of these words occur at
              least once.
            </p>

            <p className="mb-4 mt-4 block">
              For example:{" "}
              {'"(gecommitteerd OR gecommitteerdens) NOT gecommitteer"'} -{">"}{" "}
              your search results will include the word {'"gecommitteerd"'} or
              the word {'"gecommitteerdens"'} at least once, but not{" "}
              {'"gecommitteer"'}.
            </p>

            <p className="mb-4 mt-4 block">
              For example: {'"commissie NOT "seeckere commissie"'} -{">"} will
              show results in which the word {'"commissie"'} appears, but not if
              it is part of the phrase {'"seeckere commissie"'}.
            </p>

            <p className="mb-4 mt-4 block">
              For example: {'"(commis* OR gecommit*) NOT committeeren"'} -{">"}{" "}
              You will get results containing words starting with {'"commis"'}{" "}
              or {'"gecommit"'}, but not containing the word {'"committeeren"'}.
              Note: this search can also be simplified to{" "}
              {'"*commi* NOT gecommitteerden"'}).
            </p>

            <h4>Punctuation</h4>

            <p className="mb-4 mt-4 block">
              Note that when you expand a keyword search with a wildcard the
              search engine will treat all matching characters the same,
              including punctuation. For example, {'"slaafbaarheijd?"'} -{">"}{" "}
              will include pages with {'"slaafbaarheijd,"'} since the comma at
              the end is being treated as part of the word. Without adding the ?
              or * wildcard at the end of the keyword, {'"slaafbaarheijd"'} -
              {">"} will not find instances of {'"slaafbaarheijd,"'} with a
              comma at the end.
            </p>

            <p className="mb-4 mt-4 block">
              Since * and ? are normally used as wildcards, you need to take
              special measures to include these in your search term as regular
              characters. This is done by placing the character after a
              backslash (\). For example, to find all words ending in question
              marks, use {'"??\\?"'} -{">"} this will find all two letter words
              ending in a question mark, such as {'"is?"'}.
            </p>
          </>
        )}
        {searchResults ? (
          <SearchPagination
            prevPageClickHandler={prevPageClickHandler}
            nextPageClickHandler={nextPageClickHandler}
            pageNumber={pageNumber}
            searchResults={searchResults}
            elasticSize={elasticSize}
          />
        ) : null}
      </div>
    </div>
  );
};
