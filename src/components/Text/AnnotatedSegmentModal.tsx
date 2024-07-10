import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "../../MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";

import { StyledText } from "./StyledText.tsx";
import { LineSegmentsViewer } from "./Annotated/LineSegmentsViewer.tsx";
import _ from "lodash";
import {
  GroupedSegments,
  isNestedAnnotationSegment,
} from "./Annotated/AnnotationModel.ts";
import { isEntityBody } from "../../model/AnnoRepoAnnotation.ts";
import { EntitySummary } from "./Annotated/EntitySummary.tsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

function SpanButton(props: PropsWithChildren<AriaButtonOptions<ElementType>>) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <span {...buttonProps} ref={ref}>
      {children}
    </span>
  );
}

export function AnnotatedSegmentModal(
  props: PropsWithChildren<{
    clickedGroup: GroupedSegments;
  }>,
) {
  const { clickedGroup } = props;
  const annotationBodies = _.unionBy(
    clickedGroup.segments
      .flatMap((s) => s.annotations)
      .filter(isNestedAnnotationSegment)
      .map((a) => a.body)
      .filter(isEntityBody),
    "id",
  );

  /**
   * Opening of model is handled by react-area
   * (see {@link DialogTrigger} and {@link useButton})
   */
  return (
    <DialogTrigger>
      <SpanButton>{props.children}</SpanButton>
      <Modal className="w-full max-w-7xl rounded-lg bg-white shadow-xl">
        <Dialog>
          {({ close }) => (
            <>
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
              <div className="rounded-b-lg bg-neutral-100 p-4">
                <ul>
                  {annotationBodies.map((a, i) => (
                    <EntitySummary key={i} body={a} />
                  ))}
                </ul>
              </div>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
