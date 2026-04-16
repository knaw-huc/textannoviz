import { StyledText } from "../StyledText.tsx";
import { GroupedSegments, TextSegmentsViewer } from "./core";
import _ from "lodash";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../../stores/project.ts";
import { ProjectEntityBody } from "../../../model/ProjectConfig.ts";
import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { ScrollableModal } from "../../common/ScrollableModal.tsx";
import { isProjectAnnotation } from "./utils/isProjectAnnotation.ts";

export function EntityModal() {
  const translateProject = useTranslateProject();
  const { isEntity, components } = useProjectStore(projectConfigSelector);
  const clickedGroup = useTextStore((s) => s.clickedGroup);
  const setClickedGroup = useTextStore((s) => s.setClickedGroup);

  const entityBodies = clickedGroup
    ? getAllEntities(clickedGroup, isEntity)
    : [];

  return (
    <ScrollableModal
      isOpen={!!clickedGroup}
      onClose={() => setClickedGroup(null)}
    >
      {clickedGroup && (
        <>
          <StyledText panel="text-modal">
            <TextSegmentsViewer segments={clickedGroup.segments} />
          </StyledText>
          <div className="rounded-b-lg bg-neutral-100 px-6 py-6 lg:px-10">
            <div className="mb-2 mt-4 font-bold">
              {translateProject("ENTITIES")}
            </div>
            <ul>
              {entityBodies.map((a, i) => (
                <components.EntitySummary key={i} body={a} />
              ))}
            </ul>
          </div>
        </>
      )}
    </ScrollableModal>
  );
}

function getAllEntities(
  clickedGroup: GroupedSegments,
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody,
) {
  const allEntitiesFromAllSegments = clickedGroup.segments
    .flatMap((s) => s.annotations)
    .filter(isProjectAnnotation)
    .map((a) => a.body)
    .filter(isEntity);
  const deduplicated = _.unionBy(allEntitiesFromAllSegments, "id");
  return deduplicated;
}
