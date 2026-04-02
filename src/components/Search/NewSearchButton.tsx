import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { Link } from "react-router-dom";

export function NewSearchButton() {
  const translate = useProjectStore(translateSelector);
  return (
    <Link
      to="/"
      reloadDocument
      className="rounded-full border border-neutral-400 bg-white px-3 py-1 text-sm text-black no-underline outline-none transition hover:bg-neutral-200 hover:text-black focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-1"
    >
      {translate("NEW_SEARCH_QUERY")}
    </Link>
  );
}
