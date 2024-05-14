import React from "react";
import { SearchFieldComponent } from "../common/SearchFieldComponent";

type InputFacetProps = {
  onSubmit: (value: string) => void;
  disabled: boolean;
  inputValue: string;
};

export function InputFacet(props: InputFacetProps) {
  const [inputValue, setInputValue] = React.useState(props.inputValue);

  console.log(inputValue);

  function onSubmitHandler() {
    props.onSubmit(inputValue);
  }

  React.useEffect(() => {
    if (props.disabled) {
      setInputValue("");
    }
  }, [props.disabled]);

  return (
    <SearchFieldComponent
      label="Filter by inv. nr."
      placeholder={`${
        props.disabled
          ? "Inv. nr. already in full text query"
          : "Press ENTER to add inv. nr. to query"
      }`}
      value={inputValue}
      onChange={(newInputValue) => setInputValue(newInputValue)}
      onClear={() => setInputValue("")}
      onSubmit={onSubmitHandler}
      isDisabled={props.disabled}
    />
  );
}
