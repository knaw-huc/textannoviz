interface FragmenterProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Fragmenter = (props: FragmenterProps) => {
  return (
    <div className="searchFacet">
      <label>Fragmenter </label>
      <select onChange={props.onChange}>
        <option>Scan</option>
        <option>Sentence</option>
        <option>None</option>
      </select>
    </div>
  );
};
