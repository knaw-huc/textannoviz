import mirador from "mirador";
import React from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { projectConfigSelector, useProjectStore } from "../../stores/project";
import { useSearchStore } from "../../stores/search";
import { zoomAnnMirador } from "../../utils/zoomAnnMirador";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const TextHighlighting = (props: TextHighlightingProps) => {
  const annotations = useAnnotationStore((state) => state.annotations);
  const projectConfig = useProjectStore(projectConfigSelector);
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const canvas = useMiradorStore((state) => state.canvas);
  const classes = new Map<number, string[]>();
  const textToHighlight = useSearchStore((state) => state.textToHighlight);
  const params = useParams();
  const [annotationsToHighlight, setAnnotationsToHighlight] = React.useState<
    AnnoRepoAnnotation[]
  >([]);

  const textLinesToDisplay: string[][] = [[]];

  React.useEffect(() => {
    const filteredAnnotations: AnnoRepoAnnotation[] = [];
    projectConfig.annotationTypesToHighlight.forEach((annotationType) => {
      const annotationsOfType = annotations.filter(
        (annotation) => annotation.body.type === annotationType,
      );
      filteredAnnotations.push(...annotationsOfType);
    });

    if (filteredAnnotations.length > 0) {
      setAnnotationsToHighlight(filteredAnnotations);
    }
  }, [annotations, projectConfig.annotationTypesToHighlight]);

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
        if (anno.body.id.includes("resolution")) {
          collectedClasses.add("underlined-resolution");
        }
        if (anno.body.id.includes("attendance_list")) {
          collectedClasses.add("underlined-attendancelist");
        }
        if (anno.body.id.includes("attendant")) {
          collectedClasses.add("underlined-attendant");
        }
        if (anno.body.id.includes("para")) {
          collectedClasses.add("underlined-reviewed");
        }
      }
    });

    let classesAsStr = "";

    collectedClasses.forEach(
      (it: string) => (classesAsStr = classesAsStr.concat(it) + " "),
    );

    return classesAsStr;
  }

  function updateMirador(bodyId: string, annotation: AnnoRepoAnnotation) {
    miradorStore.dispatch(
      mirador.actions.selectAnnotation(`${projectConfig.id}`, bodyId),
    );

    const zoom = zoomAnnMirador(annotation, canvas.canvasIds[0]);

    if (zoom) {
      miradorStore.dispatch(
        mirador.actions.updateViewport(`${projectConfig.id}`, {
          x: zoom.zoomCenter.x,
          y: zoom.zoomCenter.y,
          zoom: 1 / zoom.miradorZoom,
        }),
      );
    }
  }

  function findAnnotationIdInClassNames(
    identifier: string,
    classListArray: string[],
  ) {
    const bodyIds = classListArray.filter((className) =>
      className.includes(identifier),
    );

    if (!bodyIds) return;

    const annotations = bodyIds.map((bodyId) =>
      annotationsToHighlight.find((anno) => anno.body.id === bodyId),
    );

    toast(`You clicked on annotation(s) ${bodyIds.join(", ")}`, {
      type: "info",
    });

    if (annotations) {
      updateMirador(bodyIds[0], annotations[0]!);
    }
  }

  function spanClickHandler(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    const classListArray = Array.from(
      (event.currentTarget as HTMLSpanElement).classList,
    );

    console.log(classListArray);

    if (
      (event.currentTarget as HTMLSpanElement).classList.contains(
        "underlined-resolution",
      )
    ) {
      findAnnotationIdInClassNames("-resolution", classListArray);
    }

    if (
      (event.currentTarget as HTMLSpanElement).classList.contains(
        "underlined-attendancelist",
      )
    ) {
      findAnnotationIdInClassNames("-attendance_list", classListArray);
    }

    if (
      (event.currentTarget as HTMLSpanElement).classList.contains(
        "underlined-attendant",
      )
    ) {
      findAnnotationIdInClassNames("-attendant-", classListArray);
    }

    if (
      (event.currentTarget as HTMLSpanElement).classList.contains(
        "underlined-reviewed",
      )
    ) {
      findAnnotationIdInClassNames("-para-", classListArray);
    }
  }

  function renderLines(line: string, index: number) {
    if (textToHighlight.size === 0) {
      const result = (
        <div
          className={collectClasses(index) + "w-fit"} //collect classes beforehand so that the function is not called for every line?
          onClick={(event) => spanClickHandler(event)}
        >
          {line}
        </div>
      );

      return result;
    }

    if (textToHighlight.size > 0 && params.tier2) {
      if (textToHighlight.get(params.tier2)) {
        const toHighlightStrings = textToHighlight.get(params.tier2);
        const regexString = toHighlightStrings
          ?.map((string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|");
        const regex = new RegExp(`${regexString}`, "g");

        const result = (
          <div
            className={collectClasses(index) + "w-fit"}
            onClick={(event) => spanClickHandler(event)}
            dangerouslySetInnerHTML={{
              __html: line.replace(
                regex,
                '<span class="rounded bg-yellow-200 p-1">$&</span>',
              ),
            }}
          />
        );
        return result;
      }
    }
  }

  return (
    <>
      {textLinesToDisplay.map((lines, key) => (
        <div key={key} className="leading-loose">
          {lines.map((line, index) => renderLines(line, index))}
        </div>
      ))}
    </>
  );
};
