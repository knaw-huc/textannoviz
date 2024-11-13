import React from "react";
import { toast } from "react-toastify";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { sanitiseString } from "../../utils/sanitiseString.ts";
import { SearchFieldComponent } from "../common/SearchFieldComponent.tsx";

export function FullTextSearchBar(props: {
  fullText: string;
  onSubmit: (value: string) => void;
  onBlur: (value: string) => void;
}) {
  const [fullText, setFullText] = React.useState(props.fullText);
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  function includesTrailingBackslash(value: string): boolean {
    if (value.charAt(value.length - 1).includes("\\")) {
      return true;
    } else {
      return false;
    }
  }

  function submitHandler() {
    if (includesTrailingBackslash(fullText)) {
      toast("Please remove trailing backslash from query", { type: "error" });
      return;
    }

    const sanitisedFullText = sanitiseString(fullText);

    props.onSubmit(sanitisedFullText);
  }

  function onBlurHandler() {
    if (includesTrailingBackslash(fullText)) {
      toast("Please remove trailing backslash from query", { type: "error" });
      return;
    }

    if (fullText) {
      const sanitisedFullText = sanitiseString(fullText);
      props.onBlur(sanitisedFullText);
    }
  }

  return (
    <SearchFieldComponent
      label={translate("FULL_TEXT_SEARCH")}
      helpLabelKey={translateProject("FULL_TEXT_SEARCH_HELP")}
      value={fullText}
      onChange={(newValue) => setFullText(newValue)}
      onClear={() => setFullText("")}
      onBlur={onBlurHandler}
      placeholder={translate("PRESS_ENTER_TO_SEARCH")}
      onSubmit={submitHandler}
    />
  );
}
