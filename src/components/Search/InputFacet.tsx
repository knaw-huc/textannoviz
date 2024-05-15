import React from "react";
import { toast } from "react-toastify";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

type InputFacetProps = {
  onSubmit: (value: string) => void;
  inputValue: string;
};

export function InputFacet(props: InputFacetProps) {
  const [inputValue, setInputValue] = React.useState(props.inputValue);

  const translateProject = useProjectStore(translateProjectSelector);

  function onSubmitHandler() {
    if (inputValue.length === 0) {
      toast(translateProject("INPUT_FACET_EMPTY_WARNING"), { type: "warning" });
      return;
    }
    props.onSubmit(inputValue);
  }

  return (
    <SearchFieldComponent
      label={translateProject("INPUT_FACET_LABEL")}
      placeholder={translateProject("INPUT_FACET_PLACEHOLDER")}
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
      onSubmit={onSubmitHandler}
    />
  );
}
