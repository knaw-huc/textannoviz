import { PropsWithChildren } from "react";

import { StyledText } from "../StyledText.tsx";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import _ from "lodash";
import {
  GroupedSegments,
  isNestedAnnotationSegment,
} from "./AnnotationModel.ts";
import { EntityBody, isEntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { EntitySummary } from "./EntitySummary.tsx";
import { Optional } from "../../../utils/Optional.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../../stores/project.ts";
import { ScrollableModal } from "./ScrollableModal.tsx";
import { DialogTrigger } from "react-aria-components";
import { SpanButton } from "./SpanButton.tsx";

type AnnotationModalProps = PropsWithChildren<{
  clickedGroup: GroupedSegments;
}>;

export function AnnotationModalButton(
  props: Optional<AnnotationModalProps, "clickedGroup">,
) {
  return (
    <DialogTrigger>
      <SpanButton>{props.children}</SpanButton>
      {props.clickedGroup && (
        <AnnotationModal {...props} clickedGroup={props.clickedGroup} />
      )}
    </DialogTrigger>
  );
}

export function AnnotationModal(props: AnnotationModalProps) {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const entityAnnotationTypes = projectConfig.entityAnnotationTypes;

  const annotationCount = props.clickedGroup.segments.flatMap(
    (s) => s.annotations,
  ).length;
  const annotationCountClass = `annotations-${annotationCount}`;
  const { clickedGroup } = props;
  const entityBodies = clickedGroup
    ? _.unionBy(
        clickedGroup.segments
          .flatMap((s) => s.annotations)
          .filter(isNestedAnnotationSegment)
          .map((a) => a.body)
          .filter((a) =>
            isEntityBody(a, entityAnnotationTypes),
          ) as EntityBody[],
        "id",
      )
    : [];

  return (
    <ScrollableModal
      className={`w-full max-w-7xl rounded-lg shadow-xl ${annotationCountClass}`}
    >
      <StyledText panel="text-modal">
        <LineSegmentsViewer
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
            <EntitySummary key={i} body={a} />
          ))}
        </ul>
      </div>
    </ScrollableModal>
  );
}
