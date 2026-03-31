import { PropsWithChildren } from "react";

import { StyledText } from "../StyledText.tsx";
import { TextSegmentsViewer } from "./TextSegmentsViewer.tsx";
import _ from "lodash";
import {
  GroupedSegments,
  isNestedAnnotationSegment,
} from "./AnnotationModel.ts";
import { Optional } from "../../../utils/Optional.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { ScrollableModal } from "./ScrollableModal.tsx";
import { SpanModalButton } from "./SpanModalButton.tsx";
import { ProjectEntityBody } from "../../../model/ProjectConfig.ts";
import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";

type EntityModalProps = PropsWithChildren<{
  clickedGroup: GroupedSegments;
}>;

export function EntityModalButton(
  props: Optional<EntityModalProps, "clickedGroup"> & {
    isOpen?: boolean;
    onToggleOpen?: (isOpen: boolean) => void;
  },
) {
  return (
    <SpanModalButton
      isOpen={props.isOpen}
      onOpenChange={props.onToggleOpen}
      label={props.children}
      modal={
        props.clickedGroup && (
          <EntityModal {...props} clickedGroup={props.clickedGroup!} />
        )
      }
    />
  );
}

export function EntityModal(props: EntityModalProps) {
  const translateProject = useProjectStore(translateProjectSelector);
  const { isEntity, components } = useProjectStore(projectConfigSelector);

  const { clickedGroup } = props;
  const entityBodies = clickedGroup
    ? getAllEntities(clickedGroup, isEntity)
    : [];

  return (
    <ScrollableModal>
      <StyledText panel="text-modal">
        <TextSegmentsViewer
          segments={clickedGroup.segments}
          groupId={clickedGroup.id}
          showDetails={true}
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
  clickedGroup: GroupedSegments,
  isEntity: (toTest: AnnoRepoBodyBase) => toTest is ProjectEntityBody,
) {
  const allEntitiesFromAllSegments = clickedGroup.segments
    .flatMap((s) => s.annotations)
    .filter(isNestedAnnotationSegment)
    .map((a) => a.body)
    .filter(isEntity);
  const deduplicated = _.unionBy(allEntitiesFromAllSegments, "id");
  return deduplicated;
}
