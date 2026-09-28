import { useTranslateProject } from "../../stores/project";

type FacetItemsFilterProps = {
  inputFilterOnChangeHandler: (value: string) => void;
};

export const FacetItemsFilter = (props: FacetItemsFilterProps) => {
  const translateProject = useTranslateProject();

  return (
    <div className="px-2 pb-1 pt-2">
      <input
        name="searchInFacet"
        className="h-8 w-full rounded-md border border-neutral-400 px-2 py-1.5 text-sm text-gray-800 placeholder:italic placeholder:text-neutral-500 focus-within:border-black"
        onChange={(event) =>
          props.inputFilterOnChangeHandler(event.currentTarget.value)
        }
        placeholder={translateProject("facetInputFilterPlaceholder")}
      />
    </div>
  );
};
