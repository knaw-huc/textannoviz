import {FacetName, FacetOptionName} from "../../model/Search.ts";
import {translateProjectSelector, useProjectStore} from "../../stores/project.ts";
import {XMarkIcon} from "@heroicons/react/24/solid";

export function KeywordFacetLabel(props: {
  option: FacetOptionName
  facet: FacetName
  onRemove: (facet: string, option: string) => void
}) {
  const {option, facet, onRemove} = props;
  const translateProject = useProjectStore(translateProjectSelector);
  return (
      <div
          className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
      >
        {translateProject(facet)}:{" "}
        {/^[a-z]/.test(option)
            ? option.charAt(0).toUpperCase() + option.slice(1)
            : translateProject(option)}{" "}
        {
          <XMarkIcon
              className="h-5 w-5"
              onClick={() => onRemove(facet, option)}
          />
        }
      </div>
  );
}