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
    <div className="relative">
      <SearchField
        value={fullText}
        onChange={(newValue) => setFullText(newValue)}
        onSubmit={submitHandler}
        aria-label="Search for keyword or letter number(s)"
        onClear={() => setFullText("")}
      >
        <Input
          className="w-[188px] h-8 rounded border border-neutral-500 py-1.5 pl-2 pr-9 text-gray-800 placeholder:text-xs placeholder:italic placeholder:text-neutral-500"
          placeholder="Keyword / letter number(s)"
        />
      </SearchField>
      <div className="pointer-events-auto absolute inset-y-0 right-0 flex items-center pr-1.5">
        <HelpTooltip label={translateProject("QUICK_SEARCH_HELP")} />
      </div>
    </div>
  );
}
