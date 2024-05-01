import { HIT_PREVIEW_REGEX } from "../../components/Search/util/createHighlights";

export type SummaryProps = {
  summary: string;
  summaryHits: string[];
};

function createSummaryHighlights(hits: string[]) {
  const toHighlight = {
    map: new Map<string, string[]>(),
  };
  const previews: string[] = [];

  if (!hits) {
    return toHighlight;
  }

  hits.forEach((hit) => {
    const matches = hit
      .match(HIT_PREVIEW_REGEX)
      ?.map((str) => str.substring(4, str.length - 5));

    if (matches) {
      previews.push(...new Set(matches));
    }
  });
  toHighlight.map.set("id", [...new Set(previews)]);

  return toHighlight;
}

export function Summary(props: SummaryProps) {
  let summary = <span>{props.summary}</span>;

  const textToHighlight = createSummaryHighlights(props.summaryHits);

  if (textToHighlight.map.size > 0) {
    const toHighlightStrings = textToHighlight.map.get("id");
    const regexString = toHighlightStrings?.map((str) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );

    const regex = new RegExp(`${regexString}`, "g");

    summary = (
      <span
        dangerouslySetInnerHTML={{
          __html: props.summary.replace(
            regex,
            '<span class="rounded bg-yellow-200 p-1">$&</span>',
          ),
        }}
      ></span>
    );
  }

  return <p className="italic">Summary: {summary}</p>;
}
