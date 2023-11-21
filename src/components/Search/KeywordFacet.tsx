import { Facet, Terms } from "../../model/Search.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

export function KeywordFacet(props: {
  facetName: string;
  facet: Facet;
  selectedFacets: Terms;
  onChangeKeywordFacet: (
    facetName: string,
    facetOptionName: string,
    selected: boolean,
  ) => void;
}) {
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <div className="w-full max-w-[450px]">
      <div className="font-semibold">{translateProject(props.facetName)}</div>
      {Object.entries(props.facet).map(([facetOptionName, facetOption]) => {
        const isSelected =
          !!props.selectedFacets[props.facetName]?.includes(facetOptionName);
        const facetOptionKey = `${props.facetName}-${facetOptionName}`;
        return (
          <div
            key={facetOptionKey}
            className="mb-2 flex w-full flex-row items-center justify-between gap-2"
          >
            <div className="flex flex-row items-center">
              <input
                className="text-brand1-700 focus:ring-brand1-700 mr-2 h-5 w-5 rounded border-gray-300"
                type="checkbox"
                id={facetOptionKey}
                name={facetOptionName}
                value={facetOptionName}
                onChange={() =>
                  props.onChangeKeywordFacet(
                    props.facetName,
                    facetOptionName,
                    !isSelected,
                  )
                }
                checked={isSelected}
              />
              <label htmlFor={facetOptionKey}>
                {/^[a-z]/.test(facetOptionName)
                  ? facetOptionName.charAt(0).toUpperCase() +
                    facetOptionName.slice(1)
                  : facetOptionName && translateProject(facetOptionName)}
              </label>
            </div>
            <div className="text-sm text-neutral-500">{facetOption}</div>
          </div>
        );
      })}
    </div>
  );
}
