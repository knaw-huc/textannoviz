import { useEffect, useId, useRef, useState } from "react";
import { Button } from "react-aria-components";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useTranslateProject } from "../../stores/project";
import { useTextStore } from "../../stores/text/text-store";
import { HighlightsTab } from "./HighlightsTab";


export function HighlightsBottomSheet() {
  const entityMatches = useTextStore((state) => state.entityMatches);
  const translateProject = useTranslateProject();
  const panelId = useId();
  const [expanded, setExpanded] = useState(false);
  const prevCount = useRef(0);

  useEffect(() => {
    const count = entityMatches.length;
    if (count > 0 && prevCount.current === 0) {
      setExpanded(true);
    } else if (count === 0) {
      setExpanded(false);
    }
    prevCount.current = count;
  }, [entityMatches.length]);

  const label = translateProject("highlights");
  const countLabel =
    entityMatches.length > 0 ? ` (${entityMatches.length})` : "";
  const toggleLabel = expanded
    ? `Collapse ${label}`
    : `Expand ${label}`;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 flex max-h-[50%] flex-col border-t border-neutral-400 bg-neutral-100 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
      <Button
        onPress={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full shrink-0 cursor-pointer items-center justify-between gap-2 px-4 py-2 text-left text-xs font-bold text-neutral-700 outline-none hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-600"
      >
        <span>
          {label}
          {countLabel}
        </span>
        <span className="sr-only">{toggleLabel}</span>
        {expanded ? (
          <ChevronDownIcon className="h-4 w-4 shrink-0" aria-hidden />
        ) : (
          <ChevronUpIcon className="h-4 w-4 shrink-0" aria-hidden />
        )}
      </Button>
      {expanded && (
        <div
          id={panelId}
          role="region"
          aria-label={label}
          className="min-h-0 flex-1 overflow-auto px-4 pb-4"
        >
          <HighlightsTab />
        </div>
      )}
    </div>
  );
}
