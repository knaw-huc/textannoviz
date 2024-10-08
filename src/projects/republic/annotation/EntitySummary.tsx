import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  normalizeEntityCategory,
  toEntityClassname,
} from "../../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { useSearchStore } from "../../../stores/search/search-store.ts";
import { EntitySummaryDetails } from "./EntitySummaryDetails.tsx";
import { toEntitySearchQuery } from "./toEntitySearchQuery.ts";

export function EntitySummary(props: { body: AnnoRepoBody }) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { getAnnotationCategory } = useProjectStore(projectConfigSelector);
  const searchStore = useSearchStore();
  const navigate = useNavigate();
  const { body } = props;

  const entityCategory = normalizeEntityCategory(getAnnotationCategory(body));
  const entityClassname = toEntityClassname(entityCategory);
  return (
    <li className="mb-6 flex flex-col gap-2 border-b border-neutral-200 pb-6">
      <div>
        <div className={`${entityClassname} annotationMarker italic`}>
          {translateProject(entityCategory)}
        </div>
        <EntitySummaryDetails body={props.body} />
      </div>
      <div className="flex gap-4">
        <div>
          <button
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
            onClick={() => {
              const query = toEntitySearchQuery(props.body, searchStore);
              if (query) {
                navigate(`/?${query.toString()}`);
              } else {
                toast("Not implemented", { type: "info" });
              }
            }}
          >
            {translateProject("SEARCH_CATEGORY")}{" "}
            {translateProject(entityCategory)}
          </button>
          <div className="mt-2 italic text-neutral-600">
            {translateProject("WARNING_NEW_SEARCH")}
          </div>
        </div>

        <div>
          <button
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 transition hover:bg-neutral-200"
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
