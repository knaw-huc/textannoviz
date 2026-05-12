import isEmpty from "lodash/isEmpty";
import React from "react";
import type { Selection } from "react-aria-components";
import { useTranslate, useTranslateProject } from "../../stores/project";
import { FacetEntry } from "../../model/Search.ts";

type FacetFilterProps = {
  allPossibleKeywordFacets: FacetEntry[];
  filteredKeywordFacets: string[];
  facetFilterChangeHandler: (keys: Selection) => void;
};

export function FacetFilter(props: FacetFilterProps) {
  const [selected, setSelected] = React.useState<Selection>(new Set());
  const translateProject = useTranslateProject();
  const translate = useTranslate();

  React.useEffect(() => {
    if (props.filteredKeywordFacets.length > 0) {
      setSelected(new Set(props.filteredKeywordFacets));
    }
  }, [props.filteredKeywordFacets]);

  const selectedSet = selected as Set<string>;

  function toggleFacet(facetId: string, checked: boolean) {
    const next = new Set(selectedSet);
    if (checked) {
      next.add(facetId);
    } else {
      next.delete(facetId);
    }
    const keys = next as Selection;
    setSelected(keys);
    props.facetFilterChangeHandler(keys);
  }

  if (isEmpty(props.allPossibleKeywordFacets)) {
    return null;
  }

  return (
    <ul
      aria-label={translate("FILTER_FACETS")}
      className="flex max-h-64 list-none flex-col gap-2 overflow-auto bg-white p-1 text-sm"
    >
      {props.allPossibleKeywordFacets.map(([facetLabel], index) => {
        const inputId = `facet-filter-${index}`;
        return (
          <li key={facetLabel}>
            <label
              htmlFor={inputId}
              className="flex cursor-pointer items-start gap-2 rounded px-2 py-1 text-neutral-900 has-[:checked]:bg-neutral-100"
            >
              <input
                id={inputId}
                type="checkbox"
                checked={selectedSet.has(facetLabel)}
                onChange={(e) => toggleFacet(facetLabel, e.target.checked)}
                className="mt-0.5 size-4 shrink-0 rounded border-neutral-400 text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 focus-visible:ring-offset-2"
              />
              {translateProject(facetLabel)}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
