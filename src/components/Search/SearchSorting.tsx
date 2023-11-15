import {translateSelector, useProjectStore} from "../../stores/project.ts";
import {ASC, DESC, FacetName, SortOrder} from "../../model/Search.ts";
import {ChangeEvent} from "react";
import {toast} from "react-toastify";

export type Sorting = {
  field: string,
  order: SortOrder
}

interface SearchSortByProps {
  onSort: (sortBy: Sorting) => void;
  selected: Sorting;
  dateFacet?: FacetName
}

const SEPARATOR = '-';
const BY_DATE = 'date';
const BY_SCORE = '_score'

/**
 * Sort by _score or by date
 * TODO:
 *  - add keyword facet types
 *  - handle multiple date facets
 */
export const SearchSorting = (props: SearchSortByProps) => {
  const translate = useProjectStore(translateSelector);
  const defaultSorting: Sorting = {field: BY_SCORE, order: DESC};

  function handleSorting(event: ChangeEvent<HTMLSelectElement>) {
    const [selectedField, selectedOrder] = event.currentTarget.value.split(SEPARATOR);
    if (selectedField === BY_DATE) {
      handleDateSorting(selectedOrder as SortOrder);
    } else {
      props.onSort(defaultSorting);
    }
  }

  function handleDateSorting(selectedOrder: SortOrder) {
    const dateFacet = props.dateFacet;
    if (!dateFacet) {
      toast("No dace facets to sort by");
      props.onSort(defaultSorting);
      return;
    }
    props.onSort({
      field: dateFacet,
      order: selectedOrder
    });

  }

  function toSelectedValue(selected: Sorting): string {
    const isDateFacet = props.dateFacet === selected.field;
    if(isDateFacet) {
      return `${BY_DATE}${SEPARATOR}${selected.order}`;
    }
    return `${selected.field}${SEPARATOR}${selected.order}`;
  }

  return (
      <div className="flex items-center">
        <div className="mr-1 text-sm">{translate('SORT_BY')}</div>
        <select
            className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
            value={toSelectedValue(props.selected)}
            onChange={handleSorting}
        >
          <option value={`${BY_SCORE}-${DESC}`}>{translate('RELEVANCE')}</option>
          <option value={`${BY_DATE}-${ASC}`}>{translate('DATE_ASC')}</option>
          <option value={`${BY_DATE}-${DESC}`}>{translate('DATE_DESC')}</option>
        </select>
      </div>
  );
};
