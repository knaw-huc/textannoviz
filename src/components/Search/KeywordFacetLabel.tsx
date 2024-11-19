import { XMarkIcon } from "@heroicons/react/24/solid";
import { FacetName, FacetOptionName } from "../../model/Search.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase.ts";

export function KeywordFacetLabel(props: {
  option: FacetOptionName;
  facet: FacetName;
  onRemove: (facet: string, option: string) => void;
}) {
  const { option, facet, onRemove } = props;
  const translateProject = useProjectStore(translateProjectSelector);
  const optionClean = /^[a-z]/.test(option)
    ? firstLetterToUppercase(option)
    : translateProject(option);
  const label = `${translateProject(facet)}: ${optionClean} `;
  return (
    <div
      className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
      title={label}
    >
      <span className="overflow-hidden">{label}</span>
      <XMarkIcon className="h-5 w-5" onClick={() => onRemove(facet, option)} />
    </div>
  );
}
