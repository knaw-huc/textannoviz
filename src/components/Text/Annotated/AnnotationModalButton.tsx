import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import { AriaButtonOptions } from "@react-aria/button";

import { StyledText } from "../StyledText.tsx";
import { LineSegmentsViewer } from "./LineSegmentsViewer.tsx";
import _ from "lodash";
import {
  GroupedSegments,
  isNestedAnnotationSegment,
} from "./AnnotationModel.ts";
import { isEntityBody } from "../../../model/AnnoRepoAnnotation.ts";
import { EntitySummary } from "./EntitySummary.tsx";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Optional } from "../../../utils/Optional.ts";

type AnnotationModalProps = PropsWithChildren<{
  clickedGroup: GroupedSegments;
}>;

export function AnnotationModalButton(
  props: Optional<AnnotationModalProps, "clickedGroup">,
) {
  /**
   * Opening of model is handled by react-aria
   * (see {@link DialogTrigger} and {@link useButton})
   */
  return (
    <DialogTrigger>
      <SpanButton>{props.children}</SpanButton>
      {props.clickedGroup && (
        <AnnotationModal {...props} clickedGroup={props.clickedGroup} />
      )}
    </DialogTrigger>
  );
}

function SpanButton(props: PropsWithChildren<AriaButtonOptions<ElementType>>) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <span
      {...buttonProps}
      ref={ref}
      // @ts-expect-error useButton should not add type="button"
      type={undefined}
    >
      {children}
    </span>
  );
}

export function AnnotationModal(props: AnnotationModalProps) {
  const { clickedGroup } = props;

  const entityBodies = clickedGroup
    ? _.unionBy(
        clickedGroup.segments
          .flatMap((s) => s.annotations)
          .filter(isNestedAnnotationSegment)
          .map((a) => a.body)
          .filter(isEntityBody),
        "id",
      )
    : [];

  return (
    <Modal className="h-fit w-full max-w-7xl rounded-lg bg-white shadow-xl">
      <Dialog>
        {({ close }) => (
          <div className="scrollable-modal-content">
            <div className="my-4 flex w-full justify-end px-4">
              <button
                className="rounded bg-neutral-200 p-2"
                onClick={() => close()}
              >
                <XMarkIcon className="h-6 fill-neutral-500 stroke-neutral-800" />
              </button>
            </div>
            <StyledText panel="text-modal">
              <LineSegmentsViewer
                segments={clickedGroup.segments}
                groupId={clickedGroup.id}
                showDetails={true}
              />
            </StyledText>
            <div className="rounded-b-lg bg-neutral-100 px-6 py-6 lg:px-10">
              <div className="mb-2 mt-4 font-bold">Entiteiten</div>
              <ul>
                {entityBodies.map((a, i) => (
                  <EntitySummary key={i} body={a} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dialog>
    </Modal>
  );
}
