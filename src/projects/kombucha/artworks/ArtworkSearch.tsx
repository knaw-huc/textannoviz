export function ArtworkSearch(props: {
  query: string;
  isGlobal: boolean;
  handleQueryChange: (newQuery: string) => void;
  handleIsGlobalChecked: (newChecked: boolean) => void;
}) {
  const { query, isGlobal, handleQueryChange, handleIsGlobalChecked } = props;
  return (
    <>
      <div className="sticky top-16 z-10 mb-8 space-y-4 rounded-xl bg-neutral-100 p-6 shadow-inner">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={
              isGlobal
                ? "Search all sections..."
                : "Search within current section..."
            }
            className="flex-grow rounded-lg border-neutral-300 p-3 shadow-sm focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />

          <label className="flex cursor-pointer items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 accent-blue-600"
              checked={isGlobal}
              onChange={(e) => handleIsGlobalChecked(e.target.checked)}
            />
            Global Search
          </label>
        </div>
      </div>
      {query.trim() && (
        <div className="mb-4 ml-8 text-xs font-semibold uppercase tracking-wider text-blue-500">
          {isGlobal
            ? `Showing results from all sections matching '${query}'`
            : `Showing results from current section matching '${query}'`}
        </div>
      )}
    </>
  );
}
