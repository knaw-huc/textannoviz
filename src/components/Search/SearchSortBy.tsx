interface SearchSortByProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export const SearchSortBy = (props: SearchSortByProps) => {
  return (
    <div className="flex items-center">
      <div className="mr-1 text-sm">Sorteren op</div>
      <select
        className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
        value={props.value}
        onChange={props.onChange}
      >
        <option value="_score">Relevantie</option>
        <option value="dateAsc">Datum (oplopend)</option>
        <option value="dateDesc">Datum (aflopend)</option>
      </select>
    </div>
  );
};
