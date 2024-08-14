import { EntityBody, EntityDetail } from "../../../model/AnnoRepoAnnotation.ts";
import { trimMiddle } from "./utils/trimMiddle.ts";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import {
  alignAnnotationCategory,
  toAnnotationClassname,
} from "./utils/createAnnotationClasses.ts";
import { toast } from "react-toastify";
import dummyDetails from "./dummyEntityDetails.json";
import { MetadataDetailLabelValues } from "./MetadataDetailLabelValues.tsx";

let currentIndex = 0;

function rotateDetails() {
  const result = dummyDetails[currentIndex];
  currentIndex++;
  if (currentIndex > dummyDetails.length) {
    currentIndex = 0;
  }
  return result;
}

export function EntitySummary(props: { body: EntityBody }) {
  const { body } = props;
  const translateProject = useProjectStore(translateProjectSelector);
  const category = body.metadata.category || "";

  // TODO: replace dummy suriano data when views are fixed:
  body.metadata.details = rotateDetails() as EntityDetail[];

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
            {translateProject(alignAnnotationCategory(category))}
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
            {translateProject(alignAnnotationCategory(category))}
          </button>
        </div>
      </div>
    </li>
  );
}
