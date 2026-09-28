import { Button } from "react-aria-components";
import { useTranslateProject } from "../../stores/project";
import { activeEntityMatchSelector } from "../../stores/text/entityMatchSlice";
import { useTextStore } from "../../stores/text/text-store";

/**
 * The highlights in this letter as a list: every entity mention matching the
 * facets the reader filtered on, with what it matched and where it sits.
 *
 * Picking one reveals it, reusing the reveal that {@link useInitDetail} runs
 * for the first match — opening the panel or tab that holds it and scrolling
 * to the highlight.
 *
 * Rendered in store order, which is reading order: location by location, and
 * by offset within a location's text.
 */
export function HighlightsTab() {
  const entityMatches = useTextStore((state) => state.entityMatches);
  const activeMatch = useTextStore(activeEntityMatchSelector);
  const setActiveEntityMatchIndex = useTextStore(
    (state) => state.setActiveEntityMatchIndex,
  );
  const translateProject = useTranslateProject();

  if (!entityMatches.length) {
    return <div>{translateProject("NO_HIGHLIGHTS")}</div>;
  }

  return (
    <ul className="flex flex-col gap-1">
      {entityMatches.map((match, index) => {
        const isActive = match === activeMatch;
        return (
          <li key={match.bodyId}>
            <Button
              onPress={() => setActiveEntityMatchIndex(index)}
              className={`w-full cursor-pointer rounded px-2 py-1 text-left outline-none hover:bg-neutral-200 ${
                isActive ? "bg-neutral-200" : ""
              }`}
            >
              <span className="block">{match.value}</span>
              <span className="block text-xs text-neutral-600">
                {translateProject(match.facetName)} ·{" "}
                {translateProject(match.name)}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
