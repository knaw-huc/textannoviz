import { EntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import {
  getEntityCategory,
  normalizeEntityCategory,
  toEntityClassname,
} from "./utils/createAnnotationClasses.ts";
import { toast } from "react-toastify";
import { MetadataDetailLabelValues } from "./MetadataDetailLabelValues.tsx";

export function EntitySummary(props: { body: EntityBody }) {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const annotationCategoryPath = projectConfig.entityCategoryPath;

  const { body } = props;

  const entityCategory = normalizeEntityCategory(
    getEntityCategory(body, annotationCategoryPath),
  );
  const entityClassname = toEntityClassname(entityCategory);
  console.log("EntitySummary", props);
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div>
        <div className={`${entityClassname} annotationMarker text-sm italic`}>
          {translateProject(entityCategory)}
        </div>
        {props.body.text && <div>{trimMiddle(props.body.text, 120)}</div>}
        <MetadataDetailLabelValues details={body.metadata.details} />
      </div>
      <div className="flex gap-4">
        <div>
          <button
            className="rounded border border-neutral-300  px-3 py-1 text-sm transition hover:bg-neutral-200"
            // TODO:
            onClick={() => toast("Not implemented", { type: "info" })}
          >
            {translateProject("SEARCH_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
          <div className="mt-2 text-xs italic text-neutral-600">
            {translateProject("WARNING_NEW_SEARCH")}
          </div>
        </div>

        <div>
          <button
            className="rounded border border-neutral-300 px-3 py-1 text-sm transition hover:bg-neutral-200"
            // TODO:
            onClick={() => toast("Not implemented", { type: "info" })}
          >
            {translateProject("MORE_INFO_ON_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
        </div>
      </div>
    </li>
  );
}
