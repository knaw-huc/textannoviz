import {toast} from "react-toastify";
import {FullTextFacet} from "reactions-knaw-huc";
import {Button} from "react-aria-components";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";

export function FullTextSearchBar(props: {
  fullText: string,
  updateFullText: (query: string) => void,
  onSubmit: () => void
}) {
  const updateFullTextSearch = (value: string) => {
    if (value.charAt(value.length - 1).includes("\\")) {
      toast("Please remove trailing backslash from query", {type: "error"});
      return;
    }
    props.updateFullText(value)
  };

  return <div className="w-full max-w-[450px]">
    <label htmlFor="fullText" className="font-semibold">
      Full text search
    </label>
    <div className="flex w-full flex-row">
      <FullTextFacet
          valueHandler={updateFullTextSearch}
          enterPressedHandler={props.onSubmit}
          value={props.fullText}
          className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
          placeholder="Press ENTER to search"
      />
      <Button
          className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
          aria-label="Click to search"
          onPress={props.onSubmit}
      >
        <MagnifyingGlassIcon className="h-4 w-4 fill-white"/>
      </Button>
    </div>
  </div>
}