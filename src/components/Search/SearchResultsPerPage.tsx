import type { Key } from "react-aria-components";
import {
  SelectComponent,
  SelectItemComponent,
} from "../common/SelectComponent.tsx";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";
import { useTranslate } from "../../stores/project.ts";
import { PageSizeOption } from "../../model/Search.ts";

interface SearchResultsPerPageProps {
  onChange: (key: Key) => void;
}
export const SearchResultsPerPage = (props: SearchResultsPerPageProps) => {
  const translate = useTranslate();
  const { searchParams } = useUrlSearchParamsStore();

  const options: PageSizeOption[] = [
    { name: 10 },
    { name: 20 },
    { name: 50 },
    { name: 100 },
  ];

  const selectedOption = options.find((o) => o.name === searchParams.size);
  if (!selectedOption) {
    throw new Error("Unknown page size: " + searchParams.size);
  }
  const selectedKey: Key = selectedOption.name;

  function selectChangeHandler(key: Key | null) {
    if (key == null) return;
    props.onChange(key);
  }

  return (
    <SelectComponent
      label={translate("RESULTS_PER_PAGE")}
      labelStyling="mr-1 text-sm"
      buttonWidth="w-[95px]"
      items={options}
      value={selectedKey}
      onChange={selectChangeHandler}
    >
      {(item: PageSizeOption) => (
        <SelectItemComponent id={item.name} textValue={item.name.toString()}>
          {item.name}
        </SelectItemComponent>
      )}
    </SelectComponent>
  );
};
