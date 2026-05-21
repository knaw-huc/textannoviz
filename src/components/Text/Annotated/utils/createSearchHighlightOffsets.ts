import { TextPositions } from "../core";
import { HighlightBody } from "./highlightBodyGuards.ts";

export function createSearchHighlightOffsets(
  body: string,
  regex: RegExp | undefined,
): TextPositions[] {
  const annotations: TextPositions[] = [];
  if (!regex) {
    return annotations;
  }
  annotations.push(...createSearchAnnotation(body, regex));
  return annotations;
}

function createSearchAnnotation(
  body: string,
  regex: RegExp,
): TextPositions<HighlightBody>[] {
  const matches = findStartEndChars(body, regex);
  return matches.map((startEndChars, i) => {
    return {
      type: "highlight",
      body: {
        id: `search-highlight-${i + 1}`,
        type: "search",
      },
      start: startEndChars[0],
      end: startEndChars[1],
    };
  });
}

type StartEndChar = [number, number];

/**
 * Find start and end character indexes of regex matches in text
 * Source: https://stackoverflow.com/a/7236973/2938059
 */
function findStartEndChars(text: string, regex: RegExp): StartEndChar[] {
  const matches: StartEndChar[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text))) {
    matches.push([regex.lastIndex - match[0].length, regex.lastIndex]);
  }
  return matches;
}
