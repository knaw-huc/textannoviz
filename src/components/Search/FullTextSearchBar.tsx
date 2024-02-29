import { toast } from "react-toastify";
import { FullTextFacet } from "reactions-knaw-huc";
import { Button } from "react-aria-components";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { useState } from "react";

export function FullTextSearchBar(props: {
  fullText: string;
  onSubmit: (searchResult: string) => void;
}) {
  const [fullText, setFullText] = useState(props.fullText);
  const translate = useProjectStore(translateSelector);

  const updateFullTextSearch = (value: string) => {
    if (value.charAt(value.length - 1).includes("\\")) {
      toast("Please remove trailing backslash from query", { type: "error" });
      return;
    }
    setFullText(value);
  };

  return (
    <div className="w-full max-w-[450px]">
      <label htmlFor="fullText" className="font-semibold">
        {translate("FULL_TEXT_SEARCH")}
      </label>
      <div className="flex w-full flex-row">
        <FullTextFacet
          valueHandler={updateFullTextSearch}
          enterPressedHandler={() => props.onSubmit(fullText)}
          value={fullText}
          className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
          placeholder={translate("PRESS_ENTER_TO_SEARCH")}
        />
        <Button
          className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
          aria-label="Click to search"
          onPress={() => props.onSubmit(fullText)}
        >
          <MagnifyingGlassIcon className="h-4 w-4 fill-white" />
        </Button>
      </div>
    </div>
  );
}
