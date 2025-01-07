import React, { useEffect } from "react";
import type { Key } from "react-aria-components";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";

interface SearchResultsPerPageProps {
  onChange: (key: Key) => void;
  value: number;
}

type PageSizeOption = {
  name: number;
};

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  const translate = useProjectStore(translateSelector);
  const { searchParams } = useSearchUrlParams();
  const [selectedKey, setSelectedKey] = React.useState<Key>(searchParams.size);
  const options: PageSizeOption[] = [
    { name: 3 },
    { name: 10 },
    { name: 20 },
    { name: 50 },
    { name: 100 },
  ];

  function selectChangeHandler(key: Key) {
    props.onChange(key);
  }

  useEffect(() => {
    const foundOption = options.find((o) => o.name === searchParams.size);
    if (!foundOption) {
      throw new Error("Unknown page size: " + searchParams.size);
    }
    setSelectedKey(foundOption.name);
  }, [searchParams.size]);

  return (
    <SelectComponent
      label={translate("RESULTS_PER_PAGE")}
      labelStyling="mr-1 text-sm"
      buttonWidth="w-[95px]"
      items={options}
      selectedKey={selectedKey}
      onSelectionChange={selectChangeHandler}
    >
      {(item: PageSizeOption, i: number) => (
        <SelectItemComponent
          id={item.name}
          textValue={item.name.toString()}
          key={i}
        >
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
