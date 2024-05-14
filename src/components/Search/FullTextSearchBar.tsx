import React from "react";
import { toast } from "react-toastify";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchFieldComponent } from "../common/SearchFieldComponent.tsx";

export function FullTextSearchBar(props: {
  fullText: string;
  onSubmit: (searchResult: string) => void;
}) {
  const [fullText, setFullText] = React.useState(props.fullText);
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  function submitHandler() {
    if (fullText.charAt(fullText.length - 1).includes("\\")) {
      toast("Please remove trailing backslash from query", { type: "error" });
      return;
    }

    if (fullText.length === 0 && !projectConfig.allowEmptyStringSearch) {
      toast("No search term was specified. Please specify a search term.", {
        type: "warning",
      });
      return;
    }

    props.onSubmit(fullText);
  }

  return (
    <SearchFieldComponent
      label={translate("FULL_TEXT_SEARCH")}
      value={fullText}
      onChange={(newValue) => setFullText(newValue)}
      onClear={() => setFullText("")}
      placeholder={translate("PRESS_ENTER_TO_SEARCH")}
      onSubmit={submitHandler}
    />
  );
}
