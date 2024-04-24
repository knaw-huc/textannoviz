import React from "react";
import type { Key } from "react-aria-components";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";

interface SearchResultsPerPageProps {
  onChange: (key: Key) => void;
  value: number;
}

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  const translate = useProjectStore(translateSelector);
  const [selectedKey, setSelectedKey] = React.useState<Key>(10);

  const options = [{ name: 10 }, { name: 20 }, { name: 50 }, { name: 100 }];

  function selectChangeHandler(key: Key) {
    setSelectedKey(key);
    props.onChange(key);
  }

  return (
    <SelectComponent
      label={translate("RESULTS_PER_PAGE")}
      labelStyling="mr-1 text-sm"
      buttonWidth="w-[95px]"
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={selectChangeHandler}
    >
      {(item) => (
        <SelectItemComponent id={item.name} textValue={item.name.toString()}>
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
