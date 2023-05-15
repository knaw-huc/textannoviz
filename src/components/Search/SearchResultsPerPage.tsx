interface SearchResultsPerPageProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  return (
    <div className="searchResultsPerPage">
      Results per page
      <select onChange={props.onChange} defaultValue={10}>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>
  );
};
