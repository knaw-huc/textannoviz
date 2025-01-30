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
      className="ml-2 mr-2 h-8 rounded-md border px-2 py-1.5 text-sm text-gray-800 outline outline-0 focus-within:border-black"
      onChange={(event) =>
        props.inputFilterOnChangeHandler(event.currentTarget.value)
      }
      placeholder={translateProject("facetInputFilterPlaceholder")}
    />
  );
};
