import { Checkbox, CheckboxGroup, Label } from "react-aria-components";
import { CheckIcon } from "@heroicons/react/16/solid";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import React from "react";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore";
import { useSearchStore } from "../../stores/search/search-store";

export const SelectSearchInTextViews = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const [selected, setSelected] = React.useState<string[]>(
    projectConfig.viewsToSearchIn,
  );
  const { updateSearchQuery } = useUrlSearchParamsStore();
  const { isInitSearch } = useSearchStore();

  React.useEffect(() => {
    //Only update the search query once the search interface is initialised.
    if (isInitSearch) {
      updateSearchQuery({ searchInTextView: selected });
    }
  }, [selected, isInitSearch]);

  return (
    <CheckboxGroup value={selected} onChange={setSelected}>
      <Label className="font-semibold">Search in</Label>
      {/* TODO: This can also be done on basis of result of /indices and then filter on all fields with type 'text'? */}
      {projectConfig.viewsToSearchIn.map((view, index) => (
        <Checkbox
          className="flex items-center gap-2 pb-1 pl-2 pt-1 transition"
          key={index}
          value={view}
        >
          {({ isSelected }) => (
            <>
              <div
                className={`${
                  isSelected ? "bg-brand2-500 border-brand2-500" : ""
                } flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition`}
              >
                {isSelected && <CheckIcon className="h-5 w-5 text-white" />}
              </div>
              {translateProject(view)}
            </>
          )}
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};
