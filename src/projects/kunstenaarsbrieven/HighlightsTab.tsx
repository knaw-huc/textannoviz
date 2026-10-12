import { Button } from "react-aria-components";
import { useTranslate, useTranslateProject } from "../../stores/project";
import { activeSearchHitSelector } from "../../stores/text/searchHitSlice";
import { useTextStore } from "../../stores/text/text-store";

/**
 * The highlights in this letter as a list: every entity mention matching the
 * facets the reader filtered on and every full-text search hit, with what it
 * matched and where it sits.
 *
 * Picking one reveals it, reusing the reveal that {@link useInitDetail} runs
 * for the first match — opening the panel or tab that holds it and scrolling
 * to the highlight.
 *
 * Rendered in store order, which is reading order: location by location, and
 * by offset within a location's text.
 */
export function HighlightsTab() {
  const searchHits = useTextStore((state) => state.searchHits);
  const activeMatch = useTextStore(activeSearchHitSelector);
  const setActiveSearchHitIndex = useTextStore(
    (state) => state.setActiveSearchHitIndex,
  );
  const translate = useTranslate();
  const translateProject = useTranslateProject();

  if (!searchHits.length) {
    return <div>{translateProject("NO_HIGHLIGHTS")}</div>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {searchHits.map((match, index) => {
        const isActive = match === activeMatch;
        return (
          <li key={match.anchor}>
            <Button
              onPress={() => setActiveSearchHitIndex(index)}
              className={`w-full cursor-pointer rounded px-2 py-1 text-left outline-none hover:bg-neutral-200 ${
                isActive ? "bg-neutral-200" : ""
              }`}
            >
              <span className="block">{match.value}</span>
              <span className="block text-xs text-neutral-600">
                {match.kind === "entity"
                  ? translateProject(match.facetName)
                  : translate("FULL_TEXT_SEARCH")}{" "}
                · {translateProject(match.name)}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
