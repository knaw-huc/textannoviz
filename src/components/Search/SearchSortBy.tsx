interface SearchSortByProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export const SearchSortBy = (props: SearchSortByProps) => {
  return (
    <div className="sortBy">
      Sort by:
      <select
        value={props.value}
        onChange={props.onChange}
        style={{ marginLeft: "5px" }}
      >
        <option value="_score">Relevance</option>
        <option value="dateAsc">Date (asc)</option>
        <option value="dateDesc">Date (desc)</option>
      </select>
    </div>
  );
};
