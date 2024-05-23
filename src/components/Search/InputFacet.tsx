import React from "react";
import { toast } from "react-toastify";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { sanitiseString } from "../../utils/sanitiseString";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

type InputFacetProps = {
  onSubmit: (value: string) => void;
  onBlur: (value: string) => void;
  inputValue: string;
};

export function InputFacet(props: InputFacetProps) {
  const [inputValue, setInputValue] = React.useState(props.inputValue);

  const translateProject = useProjectStore(translateProjectSelector);

  function onSubmitHandler() {
    const sanitisedInputValue = sanitiseString(inputValue);

    if (sanitisedInputValue.length === 0) {
      toast(translateProject("INPUT_FACET_EMPTY_WARNING"), { type: "warning" });
      return;
    }

    props.onSubmit(sanitisedInputValue);
  }

  function onBlurHandler() {
    const sanitisedInputValue = sanitiseString(inputValue);

    props.onBlur(sanitisedInputValue);
  }

  return (
    <SearchFieldComponent
      label={translateProject("INPUT_FACET_LABEL")}
      placeholder={translateProject("INPUT_FACET_PLACEHOLDER")}
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
      onBlur={onBlurHandler}
      onSubmit={onSubmitHandler}
    />
  );
}
