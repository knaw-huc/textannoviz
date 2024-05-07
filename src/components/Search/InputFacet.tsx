import React from "react";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

export function InputFacet() {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <SearchFieldComponent
      label="Filter by inv. nr."
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
    />
  );
}
