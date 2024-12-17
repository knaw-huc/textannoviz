import { LineOffsets, HighlightBody } from "../AnnotationModel.ts";

export function createSearchHighlightOffsets(
  lines: string[],
  regex: RegExp | undefined,
): LineOffsets[] {
  const annotations: LineOffsets[] = [];
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
): LineOffsets<HighlightBody>[] {
  const line = lines[index];
  const matches = findStartEndChars(line, regex);
  return matches.map((startEndChars, i) => {
    return {
      type: "highlight",
      body: {
        id: `search-highlight-${i + 1}`,
        type: "search",
      },
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
