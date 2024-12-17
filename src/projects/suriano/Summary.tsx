import uniq from "lodash/uniq";
import { HIT_PREVIEW_REGEX } from "../../components/Search/util/createHighlights";

export type SummaryProps = {
  summary: string;
  summaryHits: string[] | undefined;
};

function createSummaryHighlights(hits: string[]) {
  const toHighlight: string[] = [];

  if (!hits) {
    return toHighlight;
  }

  hits.forEach((hit) => {
    const matches = hit
      .match(HIT_PREVIEW_REGEX)
      ?.map((str) => str.substring(4, str.length - 5));

    if (matches) {
      toHighlight.push(...matches);
    }
  });

  const uniqueToHighlight = uniq(toHighlight);

  return uniqueToHighlight;
}

export function Summary(props: SummaryProps) {
  let summary = <span>{props.summary}</span>;

  if (props.summaryHits) {
    const textToHighlight = createSummaryHighlights(props.summaryHits);

    if (textToHighlight.length > 0) {
      const regexStrings = textToHighlight?.map((str) =>
        str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      );

      const joinedRegexString = regexStrings?.join("|");

      const regex = new RegExp(`${joinedRegexString}`, "g");

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
  }

  return <p className="italic">Summary: {summary}</p>;
}
