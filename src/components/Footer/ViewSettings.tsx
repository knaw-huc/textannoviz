export const ViewSettings = () => {
  return (
    <div>
      <div className="flex items-center *:border-y *:border-stone-500 *:bg-white *:px-1 *:py-2 *:text-sm *:md:p-2">
        <div className="rounded-l-full border-x italic text-neutral-500">
          View
        </div>
        <button className="hidden items-center gap-1 border-r md:flex">
          Facsimile
        </button>
        <button className="hidden gap-1 border-r md:flex">
          Transcriptie NL
        </button>
        <button className="hidden gap-1 border-r md:flex">Vertaling EN</button>
        <button className="hidden items-center gap-1 border-r md:flex">
          Info
        </button>
        <button className="hidden items-center gap-1 rounded-r-full border-r md:flex">
          Settings
        </button>
      </div>
    </div>
  );
};
