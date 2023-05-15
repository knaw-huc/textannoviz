interface SearchSortByProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SearchSortBy = (props: SearchSortByProps) => {
  return (
    <div className="sortBy">
      Sort by:
      <select onChange={props.onChange}>
        <option value="_score">Relevance</option>
        <option value="dateAsc">Date (asc)</option>
        <option value="dateDesc">Date (desc)</option>
      </select>
    </div>
  );
};
