import { toast } from "react-toastify";
import { RepublicEntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import {
  alignAnnotationCategory,
  toAnnotationClassname,
} from "./utils/createAnnotationClasses.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";

export function EntitySummary(props: { body: RepublicEntityBody }) {
  const { body } = props;
  const translateProject = useProjectStore(translateProjectSelector);
  const category = body.metadata.category || "";
  const projectConfig = useProjectStore(projectConfigSelector);

  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div>
        <div
          className={`${toAnnotationClassname(
            category,
          )} annotationMarker text-sm italic`}
        >
          {translateProject(alignAnnotationCategory(category))}
        </div>
        <div>{trimMiddle(body.text, 120)}</div>
        <div>{<projectConfig.components.EntityMetadata body={body} />}</div>
      </div>
      <div className="flex gap-4">
        <div>
          <button
            className="rounded border border-neutral-300  px-3 py-1 text-sm transition hover:bg-neutral-200"
            onClick={() => toast("Not implemented", { type: "info" })}
          >
            {translateProject("SEARCH_CATEGORY")} {translateProject(category)}
          </button>
          <div className="mt-2 text-xs italic text-neutral-600">
            {translateProject("WARNING_NEW_SEARCH")}
          </div>
        </div>

        <div>
          <button
            className="rounded border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-200"
            onClick={() => toast("Not implemented", { type: "info" })}
          >
            {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
            {translateProject(category)}
          </button>
        </div>
      </div>
    </li>
  );
}
