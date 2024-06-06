import { RelativeTextAnnotation } from "../Model.ts";

export function createSearchAnnotations(
  lines: string[],
  regex: RegExp | undefined,
): RelativeTextAnnotation[] {
  const annotations: RelativeTextAnnotation[] = [];
  if (!regex) {
    return annotations;
  }
  for (let i = 0; i < lines.length; i++) {
    annotations.push(...createSearchAnnotation(lines, i, regex));
  }
  return annotations;
}

function createSearchAnnotation(
  lines: string[],
  index: number,
  regex: RegExp,
): RelativeTextAnnotation[] {
  const line = lines[index];
  const matches = findStartEndChars(line, regex);
  return matches.map((startEndChars, i) => {
    return {
      id: `search-match-${i}`,
      type: "search",
      lineIndex: index,
      startChar: startEndChars[0],
      endChar: startEndChars[1],
    };
  });
}

type StartEndChar = [number, number];

/**
 * Find start and end character indexes of regex matches in line
 * Source: https://stackoverflow.com/a/7236973/2938059
 */
function findStartEndChars(line: string, regex: RegExp): StartEndChar[] {
  const matches: StartEndChar[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(line))) {
    matches.push([regex.lastIndex - match[0].length, regex.lastIndex]);
  }
  return matches;
}
