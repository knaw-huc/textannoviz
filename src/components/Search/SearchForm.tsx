import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import uniq from "lodash/uniq";
import React from "react";
import type { Key, Selection } from "react-aria-components";
import { Terms } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  FacetEntry,
  SearchQuery,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { CheckboxFacets } from "./CheckboxFacets.tsx";
import { DateFacet } from "./DateFacet.tsx";
import { FacetFilter } from "./FacetFilter.tsx";
import { FragmenterSelection } from "./FragmenterSelection.tsx";
import { FullTextSearchBar } from "./FullTextSearchBar.tsx";
import { InputFacet } from "./InputFacet.tsx";
import { NewSearchButton } from "./NewSearchButton.tsx";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { SliderFacet } from "./SliderFacet.tsx";
import { removeTerm } from "./util/removeTerm.ts";

interface SearchFormProps {
  onSearch: () => void;
  checkboxFacets: FacetEntry[];
  updateAggs: (query: SearchQuery) => void;
}

const searchFormClasses =
  "hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10";

export function SearchForm(props: SearchFormProps) {
  const { onSearch } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const queryHistory = useSearchStore((state) => state.searchQueryHistory);
  const [isFromDateValid, setIsFromDateValid] = React.useState(true);
  const [isToDateValid, setIsToDateValid] = React.useState(true);
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
      //TODO: update nestedFacets to use labelName instead of facetName/nesting? So: "entitiesName" instead of "entities"
      const initialFilteredAggs = props.checkboxFacets.reduce<string[]>(
        (acc, checkboxFacet) => {
          if (
            projectConfig.defaultCheckboxAggsToRender.includes(
              checkboxFacet.facetName,
            )
          ) {
            acc.push(checkboxFacet.facetName);
          }
          return acc;
          // if (
          //   projectConfig.defaultCheckboxAggsToRender.includes(
          //     checkboxFacet.facetName,
          //   )
          // ) {
          //   if (checkboxFacet.type === "flat") {
          //     acc.push(checkboxFacet.facetName);
          //   }

          //   if (checkboxFacet.type === "nested") {
          //     const topFacetKey = checkboxFacet.facetName;
          //     const nestedFacetKeys = Object.keys(checkboxFacet.facetItems).map(
          //       (nestedFacetKey) =>
          //         topFacetKey +
          //         nestedFacetKey.charAt(0).toUpperCase() +
          //         nestedFacetKey.slice(1),
          //     );
          //     acc.push(...nestedFacetKeys);
          //   }
          // }
          // return acc;
        },
        [],
      );
      setDefaultAggsIsInit(true);
      setFilteredAggs(initialFilteredAggs);
    }
  }, [props.checkboxFacets, projectConfig.defaultCheckboxAggsToRender]);

  function updateCheckboxFacet(
    facetName: string,
    labelName: string,
    facetOptionName: string,
    selected: boolean,
  ) {
    const newTerms: Terms = { ...searchQuery.terms };

    console.log(selected);

    const nestedTerms = projectConfig.nestedFacets
      .filter((nestedFacet) => labelName.startsWith(nestedFacet))
      .map((nestedFacet) => ({
        nesting: nestedFacet,
        facetName: facetName,
        facetOptionName: facetOptionName,
        selected: selected,
      }));

    nestedTerms.forEach((nestedTerm) => {
      if (!nestedTerm.selected) {
        removeTerm(
          newTerms,
          nestedTerm.facetName,
          nestedTerm.facetOptionName,
          nestedTerm.nesting,
        );
      } else {
        const facet = newTerms[nestedTerm.nesting];
        if (facet && typeof facet === "object" && !Array.isArray(facet)) {
          if (facet[nestedTerm.facetName]) {
            facet[nestedTerm.facetName].push(nestedTerm.facetOptionName);
          } else {
            facet[nestedTerm.facetName] = [nestedTerm.facetOptionName];
          }
        } else {
          newTerms[nestedTerm.nesting] = {
            [nestedTerm.facetName]: [nestedTerm.facetOptionName],
          };
        }
      }
    });

    const isNested = nestedTerms.some(
      (nestedTerm) => nestedTerm.facetName === facetName,
    );

    if (!isNested) {
      if (!selected) {
        removeTerm(newTerms, facetName, facetOptionName);
      } else {
        const facet = newTerms[facetName];
        if (facet && Array.isArray(facet)) {
          facet.push(facetOptionName);
        } else {
          {
            newTerms[facetName] = [facetOptionName];
          }
        }
      }
    }

    console.log(newTerms);
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

  function facetFilterChangeHandler(keys: Selection) {
    const updatedFilteredAggs = Array.from(keys) as string[];
    console.log(updatedFilteredAggs);
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

      {projectConfig.showCheckboxFacets && !isEmpty(props.checkboxFacets) && (
        <>
          <CheckboxFacets
            filteredAggs={filteredAggs}
            facets={props.checkboxFacets}
            onChangeCheckboxFacet={updateCheckboxFacet}
            onSearch={props.onSearch}
            updateAggs={props.updateAggs}
          />
        </>
      )}
    </div>
  );
}
