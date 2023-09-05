export function matchString(toMatchString: string, regex: RegExp) {
  const matches = toMatchString.match(regex);

  return matches;
}
