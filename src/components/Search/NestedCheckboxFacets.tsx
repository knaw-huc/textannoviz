import { NestedFacet, Terms } from "../../model/Search";
import { SearchQuery } from "../../stores/search/search-query-slice";
import { FlatCheckboxFacet } from "./FlatCheckboxFacet";

export function NestedCheckboxFacets(props: {
  facetName: string;
  facets: NestedFacet;
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
  const facets = Object.entries(props.facets).map(([name, values]) => {
    return {
      type: "flat",
      facetName: name,
      labelName: props.facetName + name.charAt(0).toUpperCase() + name.slice(1),
      facetItems: values,
    };
  });

  return (
    <>
      {facets.map((facet) => (
        <FlatCheckboxFacet
          key={facet.facetName}
          facetName={facet.facetName}
          labelName={facet.labelName}
          facet={facet.facetItems}
          selectedFacets={props.selectedFacets}
          onChangeCheckboxFacet={props.onChangeCheckboxFacet}
          onSearch={props.onSearch}
          updateAggs={props.updateAggs}
        />
      ))}
    </>
  );
}
