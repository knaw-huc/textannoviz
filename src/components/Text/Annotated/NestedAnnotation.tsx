import {
  AnnotationBodyId,
  AnnotationSegment,
  isNestedAnnotationSegment,
  Segment,
} from "./AnnotationModel.ts";
import { createAnnotationClasses } from "./utils/createAnnotationClasses.ts";
import { SearchHighlightAnnotation } from "./SearchHighlightAnnotation.tsx";
import { DepthCorrection } from "./DepthCorrection.tsx";
import { PropsWithChildren } from "react";
import {
  Button,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
} from "react-aria-components";
import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";

export type NestedAnnotationProps = {
  segment: Segment;
  toNest: AnnotationSegment[];
  depthCorrection: number;
  clickedOn: AnnotationBodyId | undefined;
  hoveringOn: AnnotationBodyId | undefined;
};

export function NestedAnnotation(props: NestedAnnotationProps) {
  const nestedAnnotations = props.toNest.filter(isNestedAnnotationSegment);
  const toRender = nestedAnnotations[0];
  const toNest = nestedAnnotations.slice(1);

  const emptyAnnotationSpace = toNest[0]
    ? toNest[0].depth - toRender.depth - 1
    : 0;

  if (!nestedAnnotations.length) {
    return (
      <SearchHighlightAnnotation
        segment={props.segment}
        depthCorrection={props.depthCorrection}
      />
    );
  }
  return (
    <span
      className={createAnnotationClasses(
        props.segment,
        toRender,
        props.hoveringOn,
      )}
    >
      <ClickedAnnotationPopover
        annotation={
          props.toNest.find((a) => a.body.id === props.clickedOn)
            ?.body as AnnoRepoBody
        }
      >
        <DepthCorrection depthCorrection={emptyAnnotationSpace}>
          {toNest.length ? (
            <NestedAnnotation {...props} toNest={toNest} />
          ) : (
            <SearchHighlightAnnotation
              segment={props.segment}
              depthCorrection={props.depthCorrection}
            />
          )}
        </DepthCorrection>
      </ClickedAnnotationPopover>
    </span>
  );
}

export function ClickedAnnotationPopover(
  props: PropsWithChildren<{
    annotation?: AnnoRepoBody;
  }>,
) {
  if (!props.annotation) {
    return <>{props.children}</>;
  }
  return (
    <>
      <DialogTrigger>
        <Button className="text-button">{props.children}</Button>
        <Popover>
          <OverlayArrow />
          <Dialog>
            {props.annotation.type} / {props.annotation.metadata.category} /{" "}
            {props.annotation.id}
          </Dialog>
        </Popover>
      </DialogTrigger>
    </>
  );
}
