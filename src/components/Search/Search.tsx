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
import { SearchItem } from "./SearchItem";
import { SearchPagination } from "./SearchPagination";
import { SearchResultsPerPage } from "./SearchResultsPerPage";
import { SearchSortBy } from "./SearchSortBy";
import {translateSelector, useProjectStore} from "../../stores/project.ts";

type SearchProps = {
  project: string;
  projectConfig: ProjectConfig;
  indices: Indices;
  facets: Facets;
  indexName: string;
  searchFacetTitles: Record<string, string>;
};

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

export const Search = (props: SearchProps) => {
  const translate = useProjectStore(translateSelector);

  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
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
      if(!data) {
        return;
      }

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
    const toHighlight = new Map<string, string[]>();
    if (!data) {
      return toHighlight;
    }

    data.results.forEach((result) => {
      const previews: string[] = [];
      const searchHits = result._hits;
      if(!searchHits) {
        return;
      }
      searchHits.forEach((hit) => {
        const matches = hit.preview
          .match(HIT_PREVIEW_REGEX)
          ?.map(str => str.substring(4, str.length - 5));
        if (matches) {
          previews.push(...new Set(matches));
        }
      });
      toHighlight.set(result._id, [...new Set(previews)]);
    });

    return toHighlight;
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

    if (!fullText && Object.keys(searchQuery.terms).length === 0) {
      toast("Please select a facet or use the full text search.", {
        type: "info",
      });
      return;
    }

    setQuery(searchQuery);
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
    if(!data) {
      return;
    }

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
              {translate('NEW_SEARCH_QUERY')}
            </Link>
          </div>
        ) : null}

        <div className="w-full max-w-[450px]">
          <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter} />
        </div>
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
            <h4>Introduction</h4>

            <p className="mb-4 mt-4 block">
              Welcome to the beta <i>GLOBALISE Transcriptions Viewer</i>. This
              tool allows you to easily search and view the machine-generated
              transcriptions and page images of the{" "}
              <a href="https://globalise.huygens.knaw.nl">GLOBALISE project</a>{" "}
              source corpus side-by-side in a web browser. A detailed
              explanation of how to use this viewer, with search tips, is
              available via the{" "}
              <a href="https://transcriptions.globalise.huygens.knaw.nl/help">
                Help
              </a>{" "}
              link at the top of the screen.
            </p>

            <p className="mb-4 mt-4 block">
              Please note: the Transcriptions Viewer is <u>not</u> an early
              version of the GLOBALISE research portal. It was designed as an
              interim solution for searching and exploring the GLOBALISE corpus
              until the research infrastructure is released to the public in
              2026.
            </p>

            <p className="mb-4 mt-4 block">
              We will continue to make small improvements to the Transcriptions
              Viewer on an ongoing basis but we currently have no plans to
              substantially expand its functionality in the future. In the
              period leading up to the release of the research infrastructure we
              will, continue to publish data on the{" "}
              <a href="https://datasets.iisg.amsterdam/dataverse/globalise">
                GLOBALISE Dataverse
              </a>{" "}
              repository and experiment with ways to make our data and
              transcriptions more accessible. These experiments are shared on
              the{" "}
              <a href="http://lab.globalise.huygens.knaw.nl/">GLOBALISE Lab</a>{" "}
              page.
            </p>

            <h4>Data and License</h4>

            <p className="mb-4 mt-4 block">
              The c. 4.8M transcriptions accessible from the GLOBALISE
              Transcriptions Viewer are drawn from the{" "}
              <i>
                <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02/">
                  Overgekomen brieven en papieren
                </a>
              </i>{" "}
              (1610-1796) collection of the Dutch East India Company (VOC)
              preserved at the Netherlands National Archives, The Hague, under
              VOC inventory numbers 1053-4454 and 7527-11024. These
              transcriptions represent the first (v1.0) version of the
              machine-generated HTR created in May, 2023.
            </p>

            <p className="mb-4 mt-4 block">
              The transcriptions are made available under a{" "}
              <a href="http://creativecommons.org/publicdomain/zero/1.0">
                Creative Commons CC0 v1
              </a>{" "}
              license. You are free to build upon, enhance, and reuse the
              transcriptions for any purposes without restriction. A full copy
              of the GLOBALISE transcriptions is{" "}
              <a href="https://hdl.handle.net/10622/JCTCJ2">
                freely available for download
              </a>
              . The scans of the original documents are available on the{" "}
              <a href="https://www.nationaalarchief.nl/onderzoeken/archief/1.04.02/">
                {" "}
                website of the National Archives
              </a>
              , also under a CC0 v1 license. Please reference the GLOBALISE
              project and the National Archives when using these transcriptions
              using this format:{" "}
              <code className="bg-gray-300">
                NL-HaNA, VOC, [inv.nr.], [scan nr.], transcription GLOBALISE
                project (https://globalise.huygens.knaw.nl/), May 2023.
              </code>
            </p>

            <p className="mb-4 mt-4 block">
              Please note that these machine-generated transcriptions will
              contain errors. They have not been manually checked for accuracy
              or completeness. Some labels, characterisations and information
              about persons, actions and events may be offensive and troubling
              to individuals and communities. Be careful when relying on the
              transcriptions and be aware of their limitations.
            </p>

            <p className="mb-4 mt-4 block">
              In order to diagnose errors, and to improve the quality and
              stability of the Transcriptions Viewer, we temporarily log all
              search queries.
            </p>

            <h4>Feedback</h4>

            <p className="mb-4 mt-4 block">
              We greatly value your feedback. Please share your comments and
              questions about the Transcription Viewer via our{" "}
              <a href="https://globalise.huygens.knaw.nl/contact-us/">
                contact page
              </a>
              .
            </p>

            <h4>Credits</h4>

            <p className="mb-4 mt-4 block">
              <a href="https://globalise.huygens.knaw.nl">GLOBALISE</a> is a
              project based at the{" "}
              <a href="https://huygens.knaw.nl">Huygens Institute</a> (KNAW
              Humanities Cluster) in the Netherlands funded by the Dutch
              Research Council (NWO) under grant no. 175.2019.003.
            </p>

            <p className="mb-4 mt-4 block">
              Page Layout and Handwritten Text Recognition:{" "}
              <a href="https://di.huc.knaw.nl/computer-vision-en.html">
                Computer Vision
              </a>{" "}
              group (Rutger van Koert, Stefan Klut, Martijn Maas), Digital
              Infrastructure Department, KNAW Humanities Cluster using the{" "}
              <a href="https://github.com/knaw-huc/loghi">
                Loghi open-source HTR platform
              </a>
              .
            </p>

            <p className="mb-4 mt-4 block">
              Transcriptions Viewer:{" "}
              <a href="https://di.huc.knaw.nl/text-analysis-en.html">
                Text Analysis
              </a>{" "}
              group (Hennie Brugman, Sebastiaan van Daalen, Hayco de Jong, Bram
              Buitendijk), Digital Infrastructure Department, KNAW Humanities
              Cluster using the open-source{" "}
              <a href="https://github.com/knaw-huc/textannoviz">TextAnnoViz</a>,{" "}
              <a href="https://github.com/knaw-huc/textrepo">TextRepo</a>,{" "}
              <a href="https://github.com/knaw-huc/annorepo">AnnoRepo</a>, and{" "}
              <a href="https://github.com/knaw-huc/broccoli">Broccoli</a>{" "}
              infrastructure.
            </p>

            <p className="mb-4 mt-4 block">
              Ground truth: The page layout and handwritten text recognition
              models used to generate the transcriptions build on a large
              collection of ground truth. We especially wish to thank the
              Netherlands National Archives, the Amsterdam City Archives, and
              the Huygens Institute for their prior work in this area. Reference
              transcriptions and region layout data to finetune the HTR models
              for the GLOBALISE corpus were created by GLOBALISE team members
              Kay Pepping, Maartje Hids, Merve Tosun, and Femke Brink.
            </p>

            <h4>Release Notes</h4>

            <p className="mb-4 mt-4 block">v0.2 (3 Oct 2023)</p>

            <ul className="mb-4 mt-4 block list-disc pl-10">
              <li className="list-item">
                The zoom and navigation icons for the image viewer sometimes
                appear in the wrong place. You can fix this by reloading the
                page in your browser.
              </li>
              <li className="list-item">
                The navigation icons in the image viewer are not linked to the
                transcripts (i.e. they can only be used to browse the page
                images). To browse the transcripts and page images, please use
                the &apos;Previous&apos; and &apos;Next&apos; page controls
                beneath the transcription.
              </li>
              <li className="list-item">
                You may not be able to see the image viewer on a mobile device.
              </li>
              <li className="list-item">
                The accessibility of the Viewer is currently insufficient for
                people with, for example, sight impairment.
              </li>
            </ul>
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
