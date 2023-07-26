import { ChevronRightIcon } from "@heroicons/react/24/solid";

export const TextTopBar = () => {
  return (
    <div className="text border-brand1Grey-100 sticky top-0 w-full border-b bg-white px-20 py-2 text-sm text-neutral-600">
      <h1 className="flex flex-row">
        Maandag
        <strong className="ml-1 font-bold">4 jan 1705</strong>
        <ChevronRightIcon className="w-h mx-2 w-5 fill-neutral-400" />
        <strong>Resolutie 5</strong>
      </h1>
    </div>
  );
};
