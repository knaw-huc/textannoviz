import { translateSelector, useProjectStore } from "../../stores/project.ts";

interface SearchResultsPerPageProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
}

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  const translate = useProjectStore(translateSelector);

  return (
    <div className="flex items-center">
      <div className="mr-1 text-sm">{translate("RESULTS_PER_PAGE")}</div>
      <select
        value={props.value}
        onChange={props.onChange}
        className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};
