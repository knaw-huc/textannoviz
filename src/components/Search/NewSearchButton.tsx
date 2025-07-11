import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { Link } from "react-router-dom";

export function NewSearchButton() {
  const translate = useProjectStore(translateSelector);
  return (
    <div className="w-full max-w-[450px]">
      <Link
        to="/"
        reloadDocument
        className="bg-brand2-100 hover:bg-brand2-50 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-500 rounded px-2 py-2 text-sm text-black no-underline outline-none transition hover:text-black"
      >
        {translate("NEW_SEARCH_QUERY")}
      </Link>
    </div>
  );
}
