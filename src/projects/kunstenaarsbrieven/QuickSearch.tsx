import React from "react";
import { useUrlSearchParamsStore } from "../../components/Search/useSearchUrlParamsStore";
import { sanitiseString } from "../../utils/sanitiseString";
import { Input, SearchField } from "react-aria-components";
import { encodeObject } from "../../utils/url/UrlParamUtils";
import { SearchQuery } from "../../model/Search";
import { getViteEnvVars } from "../../utils/viteEnvVars";
import { useNavigate } from "react-router";

const BASE_URL = "/detail/urn:mace:huc.knaw.nl:vangogh:";

function normaliseLetterId(input: string): string {
  // 'RM' letters are zero-padded to 2 digits, so 'rm1' > 'rm01' (until rm25).
  const rmMatch = input.match(/^rm(\d+)$/);
  if (rmMatch) {
    return "rm" + rmMatch[1].padStart(2, "0");
  }

  // Regular letters are zero-padded to 3 digits, so '1' > '001' and '1a' > '001a'.
  // Anything else is left untouched and handled as a regular full text search.
  return input.replace(
    /^(\d+)([a-z]*)$/,
    (_, digits, suffix) => digits.padStart(3, "0") + suffix,
  );
}

export function QuickSearch(props: { letterIdSet: Set<string> | undefined }) {
  const { searchQuery, isInitSearchUrlParams } = useUrlSearchParamsStore();
  const [fullText, setFullText] = React.useState(searchQuery.fullText);
  const { routerBasename } = getViteEnvVars();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Sync input value with search query once the search url params have been initialised
    if (isInitSearchUrlParams) {
      setFullText(searchQuery.fullText);
    }
  }, [isInitSearchUrlParams]);

  function submitHandler() {
    const sanitisedLowercaseFullText = sanitiseString(fullText.toLowerCase());
    const normalisedLetterId = normaliseLetterId(sanitisedLowercaseFullText);

    // If value is a valid letterId, go to that letter.
    if (props.letterIdSet?.has(normalisedLetterId)) {
      // Check if value starts with 'rm'
      if (normalisedLetterId.startsWith("rm")) {
        // RM is uppercase in the ID, so should be made uppercase here
        navigate(`${BASE_URL}${normalisedLetterId.toUpperCase()}`);
      }
      // If value does not start with 'rm', treat it as a letter
      else {
        navigate(`${BASE_URL}let${normalisedLetterId}`);
      }
    }
    // Otherwise, treat is a regular full text search
    else {
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
  );
}
