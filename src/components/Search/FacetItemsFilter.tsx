import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";

type FacetItemsFilterProps = {
  inputFilterOnChangeHandler: (value: string) => void;
};

export const FacetItemsFilter = (props: FacetItemsFilterProps) => {
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <input
      className="ml-2 mr-2 h-8 rounded-md border border-neutral-400 px-2 py-1.5 text-sm text-gray-800 placeholder:italic placeholder:text-neutral-500 focus-within:border-black"
      onChange={(event) =>
        props.inputFilterOnChangeHandler(event.currentTarget.value)
      }
      placeholder={translateProject("facetInputFilterPlaceholder")}
    />
  );
};
