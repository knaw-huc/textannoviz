import React from "react";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { getAnnotationsByTypes } from "./Annotated/utils/getAnnotationsByTypes.ts";
import { createSearchRegex } from "./createSearchRegex.tsx";
import { useDetailNavigation } from "../Detail/useDetailNavigation.tsx";
import { normalizeClassname } from "./Annotated/utils/createAnnotationClasses.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};
/**
 * TODO: Test with data
 * TODO: Fix collectClasses?
 */
export const TextHighlighting = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectName = useProjectStore((state) => state.projectName);
  const classes = new Array<string>();
  const { highlight, tier2 } = useDetailNavigation().getDetailParams();
  const [annotationsToHighlight, setAnnotationsToHighlight] = React.useState<
    AnnoRepoAnnotation[]
  >([]);
  const annotationTypesToHighlight = useAnnotationStore(
    (state) => state.annotationTypesToHighlight,
  );

  const textToDisplay = props.text.body;

  React.useEffect(() => {
    const filteredAnnotations = getAnnotationsByTypes(
      annotations,
      annotationTypesToHighlight,
    );
    setAnnotationsToHighlight(filteredAnnotations);
  }, [annotations, annotationTypesToHighlight]);

  if (props.text.locations) {
    props.text.locations.annotations.forEach((it) => {
      classes.push(it.bodyId);
    });
  }

  function collectClasses() {
    const collectedClasses = new Set<string>();
    annotationsToHighlight.map((anno) => {
      if (classes.includes(anno.body.id)) {
        classes.forEach((indexClass) => collectedClasses.add(indexClass));
        annotationTypesToHighlight.map((annoTypeToHighlight) => {
          if (anno.body.type.includes(annoTypeToHighlight)) {
            collectedClasses.add(
              normalizeClassname(`annotated-${annoTypeToHighlight}`),
            );
          }
        });
      }
    });

    let classesAsStr = "";

    collectedClasses.forEach(
      (it: string) => (classesAsStr = classesAsStr.concat(it) + " "),
    );

    return classesAsStr;
  }

  function renderLine(line: string) {
    const classNames = collectClasses();
    let result = <span className={classNames + "w-fit"}>{line}</span>;

    if (highlight && tier2) {
      const regex = createSearchRegex(highlight, tier2)!;

      projectName === "republic" || projectName === "globalise"
        ? (result = (
            <div
              className={classNames + "w-fit"}
              dangerouslySetInnerHTML={{
                __html: line.replace(
                  regex,
                  '<span class="rounded bg-yellow-200 p-1">$&</span>',
                ),
              }}
            />
          ))
        : (result = (
            <span
              className={classNames + "w-fit"}
              dangerouslySetInnerHTML={{
                __html: line.replace(
                  regex,
                  '<span class="rounded bg-yellow-200 p-1">$&</span>',
                ),
              }}
            />
          ));
      return result;
    } else {
      if (projectName === "republic" || projectName === "globalise") {
        return <p className={classNames + "m-0 p-0"}>{line}</p>;
      } else {
        return <span className={classNames}>{line}</span>;
      }
    }
  }

  // TODO: how to test this?
  return (
    <>
      <div className="whitespace-pre-wrap leading-loose">
        <span>{renderLine(textToDisplay)}</span>
        {/* Index is reset after each new line (see LL40-45 above). This results in the index no longer being in sync with the start and end of TextRepo. I.e., a person is mentioned on start 9, end 9, it will highlight index 9, even though the index of that array was reset because of a preceding new line. */}
      </div>
    </>
  );
};
