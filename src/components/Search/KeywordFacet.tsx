import {FacetValue} from "../../model/Search.ts";
import {ChangeEvent} from "react";
import {translateProjectSelector, useProjectStore} from "../../stores/project.ts";

export function KeywordFacet(props: {
  facetName: string;
  facet: FacetValue;
  onChangeKeywordFacet: (key: string, event: ChangeEvent<HTMLInputElement>) => void;
  checkboxes: Map<string, boolean>;
}) {
  const translateProject = useProjectStore(translateProjectSelector);

  return <div className="w-full max-w-[450px]">
    <div className="font-semibold">{translateProject(props.facetName)}</div>
    {Object.entries(props.facet).map(
        ([facetKey, facetValue]) => {
          const key = `${props.facetName}-${facetKey}`;
          return (
              <div
                  key={key}
                  className="mb-2 flex w-full flex-row items-center justify-between gap-2"
              >
                <div className="flex flex-row items-center">
                  <input
                      className="text-brand1-700 focus:ring-brand1-700 mr-2 h-5 w-5 rounded border-gray-300"
                      type="checkbox"
                      id={key}
                      name={facetKey}
                      value={facetKey}
                      onChange={(event) =>
                          props.onChangeKeywordFacet(key, event)
                      }
                      checked={props.checkboxes.get(key) ?? false}
                  />
                  <label htmlFor={key}>
                    {/^[a-z]/.test(facetKey)
                        ? facetKey.charAt(0).toUpperCase() +
                        facetKey.slice(1)
                        : facetKey && translateProject(facetKey)}
                  </label>
                </div>
                <div className="text-sm text-neutral-500">
                  {facetValue}
                </div>
              </div>
          );
        },
    )}
  </div>
}