import React from "react";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

type InputFacetProps = {
  onSubmit: (value: string) => void;
};

export function InputFacet(props: InputFacetProps) {
  const [inputValue, setInputValue] = React.useState("");

  function onSubmitHandler() {
    props.onSubmit(inputValue);
  }

  return (
    <SearchFieldComponent
      label="Filter by inv. nr."
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
      onSubmit={onSubmitHandler}
    />
  );
}
