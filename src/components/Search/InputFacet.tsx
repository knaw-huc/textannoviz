import React from "react";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

type InputFacetProps = {
  onSubmit: (value: string) => void;
  inputValue: string;
};

export function InputFacet(props: InputFacetProps) {
  const [inputValue, setInputValue] = React.useState(props.inputValue);

  function onSubmitHandler() {
    props.onSubmit(inputValue);
  }

  return (
    <SearchFieldComponent
      label="Filter by inv. nr."
      placeholder="Press ENTER to add inv. nr. to query"
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
      onSubmit={onSubmitHandler}
    />
  );
}
