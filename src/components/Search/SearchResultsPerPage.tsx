import { useEffect } from "react";
import type { Key } from "react-aria-components";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";

interface SearchResultsPerPageProps {
  onChange: () => void;
}

type PageSizeOption = {
  name: number;
};

export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  const translate = useProjectStore(translateSelector);
  const { searchParams, updateSearchParams } = useSearchUrlParams();
  const options: PageSizeOption[] = [
    { name: 10 },
    { name: 20 },
    { name: 50 },
    { name: 100 },
  ];

  const selectChangeHandler = (key: Key) => {
    console.log("selectChangeHandler", key);
    updateSearchParams({
      size: key as number,
      //bring user back to first page
      from: 0,
    });
    props.onChange();
  };

  useEffect(() => {
    const foundOption = options.find((o) => o.name === searchParams.size);
    if (!foundOption) {
      throw new Error("Unknown page size: " + searchParams.size);
    }
    console.log("SearchResultsPerPage useEffect", { size: searchParams.size });
  }, [searchParams]);

  return (
    <SelectComponent
      label={translate("RESULTS_PER_PAGE")}
      labelStyling="mr-1 text-sm"
      buttonWidth="w-[95px]"
      items={options}
      selectedKey={searchParams.size}
      onSelectionChange={selectChangeHandler}
    >
      {(item: PageSizeOption) => (
        <SelectItemComponent
          id={item.name}
          textValue={item.name.toString()}
          key={item.name}
        >
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
