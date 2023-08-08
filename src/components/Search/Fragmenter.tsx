interface FragmenterProps {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export const Fragmenter = (props: FragmenterProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="mr-1 font-semibold">Fragmenter </label>
      <select
        value={props.value}
        onChange={props.onChange}
        className="border-brand1Grey-700 rounded border bg-white px-2 py-1 text-sm"
      >
        <option value="Scan">Snippet</option>
        {/* <option>Sentence</option> */}
        <option>None</option>
      </select>
    </div>
  );
};
