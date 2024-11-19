import React from "react";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";
import { getAnnotationsByTypes } from "./Annotated/utils/getAnnotationsByTypes.ts";
import { createSearchRegex } from "./createSearchRegex.tsx";
import { useDetailUrl } from "./Annotated/utils/useDetailUrl.tsx";
import { normalizeClassname } from "./Annotated/utils/createAnnotationClasses.ts";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const TextHighlighting = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectName = useProjectStore((state) => state.projectName);
  const classes = new Map<number, string[]>();
  const { highlight, tier2 } = useDetailUrl().getDetailUrlParams();
  const [annotationsToHighlight, setAnnotationsToHighlight] = React.useState<
    AnnoRepoAnnotation[]
  >([]);
  const annotationTypesToHighlight = useAnnotationStore(
    (state) => state.annotationTypesToHighlight,
  );

  const textLinesToDisplay: string[][] = [[]];

  React.useEffect(() => {
    const filteredAnnotations = getAnnotationsByTypes(
      annotations,
      annotationTypesToHighlight,
    );
    setAnnotationsToHighlight(filteredAnnotations);
  }, [annotations, annotationTypesToHighlight]);

  props.text.lines.map((token) => {
    if (token.charAt(0) === "\n") {
      textLinesToDisplay.push([]);
    }
    textLinesToDisplay[textLinesToDisplay.length - 1].push(token);
  });

  if (props.text.locations) {
    props.text.locations.annotations.forEach((it) => {
      for (
        let i = Math.max(it.start.line, 0);
        i <= Math.min(it.end.line, props.text.lines.length - 1);
        i++
      ) {
        if (classes.has(i)) {
          classes.get(i)?.push(it.bodyId);
        } else {
          classes.set(i, [it.bodyId]);
        }
      }
    });
  }

  function collectClasses(index: number) {
    const collectedClasses = new Set<string>();
    annotationsToHighlight.map((anno) => {
      const indexClasses = classes.get(index);
      if (indexClasses?.includes(anno.body.id)) {
        indexClasses.forEach((indexClass) => collectedClasses.add(indexClass));
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

  function renderLine(line: string, index: number) {
    let result = (
      <span className={collectClasses(index) + "w-fit"}>{line}</span>
    );

    if (highlight && tier2) {
      const regex = createSearchRegex(highlight, tier2)!;

      projectName === "republic" || projectName === "globalise"
        ? (result = (
            <div
              className={collectClasses(index) + "w-fit"}
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
              className={collectClasses(index) + "w-fit"}
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
        return <p className={collectClasses(index) + "m-0 p-0"}>{line}</p>;
      } else {
        return <span className={collectClasses(index)}>{line}</span>;
      }
    }
  }

  return (
    <>
      {textLinesToDisplay.map((lines, index) => (
        <div key={index} className="leading-loose" tabIndex={0}>
          {lines.map((line, index) => (
            <span key={index}>{renderLine(line, index)}</span>
          ))}
          {/* Index is reset after each new line (see LL40-45 above). This results in the index no longer being in sync with the start and end of TextRepo. I.e., a person is mentioned on start 9, end 9, it will highlight index 9, even though the index of that array was reset because of a preceding new line. */}
        </div>
      ))}
    </>
  );
};
