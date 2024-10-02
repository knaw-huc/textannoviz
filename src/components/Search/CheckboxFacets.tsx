import { FlatFacet, NestedFacet } from "../../model/Search.ts";
import {
  FacetEntry,
  SearchQuery,
} from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { FlatCheckboxFacet } from "./FlatCheckboxFacet.tsx";
import { NestedCheckboxFacets } from "./NestedCheckboxFacets.tsx";

export function CheckboxFacets(props: {
  filteredAggs: string[];
  facets: FacetEntry[];
  onChangeCheckboxFacet: (
    facetName: string,
    labelName: string,
    facetValueName: string,
    selected: boolean,
  ) => void;
  onSearch: (stayOnPage?: boolean) => void;
  updateAggs: (query: SearchQuery) => void;
}) {
  const { searchQuery } = useSearchStore();

  const { flatFacets, nestedFacets } = props.facets.reduce(
    (acc, facet) => {
      if (props.filteredAggs.includes(facet.facetName)) {
        if (facet.type === "flat") {
          acc.flatFacets.push(facet);
        } else if (facet.type === "nested") {
          acc.nestedFacets.push(facet);
        }
      }
      return acc;
    },
    {
      flatFacets: [] as FacetEntry[],
      nestedFacets: [] as FacetEntry[],
    },
  );
  // TODO: add input field to attendants.name and entities.name through which the user can filter the facet items
  return (
    <>
      {flatFacets.map((flatFacet, index) => (
        <FlatCheckboxFacet
          key={index}
          facetName={flatFacet.facetName}
          labelName={flatFacet.facetName}
          facet={flatFacet.facetItems as FlatFacet}
          selectedFacets={searchQuery.terms}
          onChangeCheckboxFacet={props.onChangeCheckboxFacet}
          onSearch={props.onSearch}
          updateAggs={props.updateAggs}
        />
      ))}
      {nestedFacets.map((nestedFacet, index) => (
        <NestedCheckboxFacets
          key={index}
          facetName={nestedFacet.facetName}
          facets={nestedFacet.facetItems as NestedFacet}
          selectedFacets={searchQuery.terms}
          onChangeCheckboxFacet={props.onChangeCheckboxFacet}
          onSearch={props.onSearch}
          updateAggs={props.updateAggs}
        />
      ))}
    </>
  );
}
