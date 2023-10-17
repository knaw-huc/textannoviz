import {translateSelector, useProjectStore} from "../../stores/project.ts";

interface SearchSortByProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export const SearchSortBy = (props: SearchSortByProps) => {
  const translate = useProjectStore(translateSelector);

  return (
    <div className="flex items-center">
      <div className="mr-1 text-sm">{translate('SORT_BY')}</div>
      <select
        className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
        value={props.value}
        onChange={props.onChange}
      >
        <option value="_score">{translate('RELEVANCE')}</option>
        <option value="dateAsc">{translate('DATE_ASC')}</option>
        <option value="dateDesc">{translate('DATE_DESC')}</option>
      </select>
    </div>
  );
};
