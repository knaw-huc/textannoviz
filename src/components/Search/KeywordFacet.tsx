import React from "react";
import { Facet, Terms } from "../../model/Search.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import {
  CheckboxComponent,
  CheckboxGroupComponent,
} from "../common/CheckboxGroupComponent.tsx";

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
  const [selected, setSelected] = React.useState<string[]>(
    props.selectedFacets[props.facetName] ?? [],
  );

  function checkboxChangeHandler(newSelected: string[]) {
    setSelected(newSelected);
  }

  return (
    <CheckboxGroupComponent
      label={translateProject(props.facetName)}
      value={selected}
      onChange={checkboxChangeHandler}
    >
      {Object.entries(props.facet).map(
        ([facetOptionName, facetOption], index) => {
          const isSelected =
            !!props.selectedFacets[props.facetName]?.includes(facetOptionName);
          const facetOptionKey = `${props.facetName}-${facetOptionName}`;
          return (
            <div
              key={index}
              className="flex w-full flex-row items-center justify-between"
            >
              <CheckboxComponent
                id={facetOptionKey}
                key={index}
                value={facetOptionName}
                onChange={() =>
                  props.onChangeKeywordFacet(
                    props.facetName,
                    facetOptionName,
                    !isSelected,
                  )
                }
                isSelected={isSelected}
              >
                {/^[a-z]/.test(facetOptionName)
                  ? facetOptionName.charAt(0).toUpperCase() +
                    facetOptionName.slice(1)
                  : translateProject(facetOptionName)}
              </CheckboxComponent>
              <div className="text-sm text-neutral-500">{facetOption}</div>
            </div>
          );
        },
      )}
    </CheckboxGroupComponent>
  );
}
