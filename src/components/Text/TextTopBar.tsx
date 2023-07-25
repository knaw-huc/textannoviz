import { ChevronRightIcon } from "@heroicons/react/24/solid";

export const TextTopBar = () => {
  return (
    <div className="sticky top-0 bg-white text-sm text text-neutral-600 w-full border-b border-brand1Grey-100 px-20 py-2">
      <h1 className="flex flex-row">
        Maandag
        <strong className="font-bold ml-1">4 jan 1705</strong>
        <ChevronRightIcon className="w-5 w-h fill-neutral-400 mx-2" />
        <strong>Resolutie 5</strong>
      </h1>
    </div>
  );
};
