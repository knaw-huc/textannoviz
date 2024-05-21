import React from "react";
import { toast } from "react-toastify";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { SearchFieldComponent } from "../common/SearchFieldComponent.tsx";

export function FullTextSearchBar(props: {
  fullText: string;
  onSubmit: (value: string) => void;
  onBlur: (value: string) => void;
}) {
  const [fullText, setFullText] = React.useState(props.fullText);
  const translate = useProjectStore(translateSelector);

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

    props.onSubmit(fullText);
  }

  function onBlurHandler() {
    if (includesTrailingBackslash(fullText)) {
      toast("Please remove trailing backslash from query", { type: "error" });
      return;
    }

    if (fullText) {
      props.onBlur(fullText);
    }
  }

  return (
    <SearchFieldComponent
      label={translate("FULL_TEXT_SEARCH")}
      value={fullText}
      onChange={(newValue) => setFullText(newValue)}
      onClear={() => setFullText("")}
      onBlur={onBlurHandler}
      placeholder={translate("PRESS_ENTER_TO_SEARCH")}
      onSubmit={submitHandler}
    />
  );
}
