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

/**
 * Browsers store non-ASCII characters percent-encoded in the URL
 * ('Coppée1880' becomes 'Copp%C3%A9e1880'), while element ids are not encoded,
 * so the hash is decoded here before it can be used as an id.
 */
export function getUrlHash(): string | null {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;

  try {
    return decodeURIComponent(hash);
  } catch {
    // Malformed escape sequence, e.g. a literal '%' inside an id
    return hash;
  }
}
