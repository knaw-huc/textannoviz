import { EntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";

export function EntitySummary(props: { body: EntityBody }) {
  const { body } = props;
  const translateProject = useProjectStore(translateProjectSelector);
  const category = body.metadata.category || "";

  console.log("EntitySummary", body);
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div className="">
        <div
          className={`underlined-${category} annotationMarker text-sm italic`}
        >
          {translateProject(category)}
        </div>
        <div className="">{trimMiddle(body.text, 120)}</div>
      </div>
      <div className="flex gap-4">
        <div className="">
          <button
            className="rounded border border-neutral-300  px-3 py-1 text-sm transition hover:bg-neutral-200"
            onClick={() => alert("Not implemented")}
          >
            Zoek naar deze commissie
          </button>
          <div className="mt-2 text-xs italic text-neutral-600">
            {translateProject("WARNING_NEW_SEARCH")}
          </div>
        </div>

        <div className="">
          <button
            className="rounded border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-200"
            onClick={() => alert("Not implemented")}
          >
            {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
            {translateProject(category)}
          </button>
        </div>
      </div>
    </li>
  );
}
