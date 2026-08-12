import React from "react";
import { useUrlSearchParamsStore } from "../../components/Search/useSearchUrlParamsStore";
import { sanitiseString } from "../../utils/sanitiseString";
import { Input, SearchField } from "react-aria-components";
import { encodeObject } from "../../utils/url/UrlParamUtils";
import { SearchQuery } from "../../model/Search";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import { useNavigate } from "react-router";
import { HelpTooltip } from "../../components/common/HelpTooltip";
import { useTranslateProject } from "../../stores/project";
import { getBaseUrl } from "./annotation/ProjectAnnotationModel";
import { letterIdToPath, normaliseLetterId } from "./utils/letterIdToPath";

export function QuickSearch(props: { letterIds: string[] | undefined }) {
  const { searchQuery, isInitSearchUrlParams } = useUrlSearchParamsStore();
  const [fullText, setFullText] = React.useState(searchQuery.fullText);
  const { routerBasename } = getViteEnvVars();
  const navigate = useNavigate();
  const translateProject = useTranslateProject();

  React.useEffect(() => {
    // Sync input value with search query once the search url params have been initialised
    if (isInitSearchUrlParams) {
      setFullText(searchQuery.fullText);
    }
  }, [isInitSearchUrlParams]);

  function submitHandler() {
    const sanitisedLowercaseFullText = sanitiseString(fullText.toLowerCase());
    const normalisedLetterId = normaliseLetterId(sanitisedLowercaseFullText);
    const baseUrl = getBaseUrl();

    // If value is a valid letterId, go to that letter.
    if (props.letterIds?.includes(normalisedLetterId)) {
      navigate(letterIdToPath(normalisedLetterId, baseUrl));
      // Otherwise, treat it as a regular full text search
    } else {
      const query: Partial<SearchQuery> = {
        fullText: sanitisedLowercaseFullText,
      };

      const encodedQuery = encodeObject({ query: query });

      location.assign(
        `${routerBasename === "/" ? "" : routerBasename}/?${encodedQuery}`,
      );
    }
  }

  return (
    <div className="flex items-center gap-2">
      <HelpTooltip label={translateProject("QUICK_SEARCH_HELP")} />
      <SearchField
        value={fullText}
        onChange={(newValue) => setFullText(newValue)}
        onSubmit={submitHandler}
        aria-label="quick search"
        onClear={() => setFullText("")}
      >
        <Input
          className="h-10 w-52 rounded border border-neutral-500 px-2 py-1.5 text-gray-800 placeholder:italic placeholder:text-neutral-500"
          placeholder="Press ENTER to search"
        />
      </SearchField>
    </div>
  );
}
