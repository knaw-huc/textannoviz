import { ElementType, PropsWithChildren, useRef } from "react";
import { useButton } from "react-aria";
import { Dialog, DialogTrigger, Modal } from "react-aria-components";
import "../../MyModal.css";
import { AriaButtonOptions } from "@react-aria/button";

import { StyledText } from "./StyledText.tsx";
import { LineSegmentsViewer } from "./Annotated/LineSegmentsViewer.tsx";
import _ from "lodash";
import {
  isNestedAnnotationSegment,
  Segment,
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
    clickedGroup: Segment[];
  }>,
) {
  const { clickedGroup } = props;
  const annotationBodies = _.unionBy(
    clickedGroup
      .flatMap((s) => s.annotations)
      .filter(isNestedAnnotationSegment)
      .map((a) => a.body)
      .filter(isEntityBody),
    "id",
  );

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
                  segments={clickedGroup}
                  showDetails={true}
                  onClickSegment={_.noop}
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
