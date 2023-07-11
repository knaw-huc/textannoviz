interface SearchResultsPerPageProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: number;
}

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  return (
    <div className="searchResultsPerPage">
      Results per page
      <select value={props.value} onChange={props.onChange}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};
