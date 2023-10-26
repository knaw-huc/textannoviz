import React from "react";
import { ProjectConfig } from "../../model/ProjectConfig";
import { FacetValue } from "../../model/Search";
import {translateProjectSelector, useProjectStore} from "../../stores/project.ts";

type KeywordFacetProps = {
  getKeywordFacets: () => [string, FacetValue][];
  keywordFacetChangeHandler: (
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  searchFacetTitles: Record<string, string>;
  projectConfig: ProjectConfig;
  checkboxStates: Map<string, boolean>;
};

export const KeywordFacet = (props: KeywordFacetProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  return props.getKeywordFacets().map(([facetName, facetValues], index) => {
    return (
      <div key={index} className="w-full max-w-[450px]">
        <div className="font-semibold">
          {props.searchFacetTitles[facetName] ?? facetName}
        </div>
        {Object.entries(facetValues)
          .map(([facetValueName, facetValueAmount]) => {
            const key = `${facetName}-${facetValueName}`;
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
                    name={facetValueName}
                    value={facetValueName}
                    onChange={(event) =>
                      props.keywordFacetChangeHandler(key, event)
                    }
                    checked={props.checkboxStates.get(key) ?? false}
                  />
                  <label htmlFor={key}>
                    {/^[a-z]/.test(facetValueName)
                      ? facetValueName.charAt(0).toUpperCase() +
                        facetValueName.slice(1)
                      : facetValueName &&
                        translateProject(facetValueName)}
                  </label>
                </div>
                <div className="text-sm text-neutral-500">
                  {facetValueAmount}
                </div>
              </div>
            );
          })}
      </div>
    );
  });
};
