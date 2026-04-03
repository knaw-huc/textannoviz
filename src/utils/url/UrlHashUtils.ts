/**
 * URL hash utils for anchor navigation
 */
export function setUrlHash(id: string): void {
  const url = `${window.location.pathname}${window.location.search}#${id}`;
  history.replaceState(null, "", url);
}

export function clearUrlHash(): void {
  const url = `${window.location.pathname}${window.location.search}`;
  history.replaceState(null, "", url);
}

export function getUrlHash(): string | null {
  const hash = window.location.hash.slice(1);
  return hash || null;
}
