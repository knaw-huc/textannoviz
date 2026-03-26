import { PropsWithChildren } from "react";

import { StyledText } from "../../StyledText.tsx";
import { TextSegmentsViewer } from "../core/TextSegmentsViewer.tsx";
import _ from "lodash";
import { GroupedSegments } from "../core";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../../stores/project.ts";
import { AnnoRepoBodyBase } from "../../../../model/AnnoRepoAnnotation.ts";
import { ProjectEntityBody } from "../../../../model/ProjectConfig.ts";
import { isProjectAnnotation } from "./utils/isProjectAnnotation.ts";
import { SpanModalButton } from "../../../common/SpanModalButton.tsx";
import { ScrollableModal } from "../../../common/ScrollableModal.tsx";

type EntityModalProps = PropsWithChildren<{
  group: GroupedSegments;
}>;

export function EntityModalButton(
  props: PropsWithChildren<{ group: GroupedSegments }>,
) {
  return (
    <SpanModalButton
      label={props.children}
      modal={<EntityModal group={props.group}>{props.children}</EntityModal>}
    />
  );
}

export function EntityModal(props: EntityModalProps) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { isEntity, components } = useProjectStore(projectConfigSelector);

  const { group } = props;
  const entityBodies = getAllEntities(group, isEntity);

  return (
    <ScrollableModal>
      <StyledText panel="text-modal">
        <TextSegmentsViewer
          segments={group.segments}
          className="fullNestedAnnotation"
        />
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
    </ScrollableModal>
  );
}

function getAllEntities(
  group: GroupedSegments,
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody,
) {
  const allEntities = group.segments
    .flatMap((s) => s.annotations)
    .filter(isProjectAnnotation)
    .map((a) => a.body)
    .filter(isEntity);
  const deduplicated = _.unionBy(allEntities, "id");
  return deduplicated;
}
