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
      <Modal style={{ width: "600px" }}>
        <Dialog>
          {({ close }) => (
            <>
              <button onClick={() => close()}>[X]</button>
              <StyledText panel="text-modal">
                <LineSegmentsViewer
                  segments={clickedGroup.segments}
                  showDetails={true}
                />
              </StyledText>
              <ul>
                {annotationBodies.map((a, i) => (
                  <EntitySummary key={i} body={a} />
                ))}
              </ul>
            </>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
