import mirador from "mirador";
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

  console.log(params, textToHighlight);

  const textLinesToDisplay: string[][] = [[]];

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
    annotations.map((anno) => {
      const indexClasses = classes.get(index);
      if (indexClasses?.includes(anno.body.id)) {
        indexClasses.forEach((indexClass) => collectedClasses.add(indexClass));
        if (anno.body.id.includes("resolution")) {
          collectedClasses.add("underlined-resolution");
        } else {
          collectedClasses.add(anno.body.id);
        }
        if (anno.body.id.includes("attendance_list")) {
          collectedClasses.add("underlined-attendancelist");
        } else {
          collectedClasses.add(anno.body.id);
        }
        if (anno.body.id.includes("attendant")) {
          collectedClasses.add("underlined-attendant");
        } else {
          collectedClasses.add(anno.body.id);
        }
        if (anno.body.id.includes("para")) {
          collectedClasses.add("underlined-reviewed");
        } else {
          collectedClasses.add(anno.body.id);
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
    const bodyId = classListArray.find((className) =>
      className.includes(identifier),
    );

    const annotation = annotations.find((anno) => anno.body.id === bodyId);

    toast(`You clicked on annotation ${bodyId}`, { type: "info" });

    if (bodyId && annotation) {
      updateMirador(bodyId, annotation);
    }
  }

  function spanClickHandler(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) {
    const classListArray = Array.from(
      (event.currentTarget as HTMLSpanElement).classList,
    );

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

  return (
    <div>
      {textLinesToDisplay.map((line, key) => (
        <div key={key} className="grid leading-loose">
          {classes.size >= 1
            ? line.map((token, index) => (
                <span
                  key={index}
                  className={collectClasses(index) + "w-fit"}
                  onClick={(event) => spanClickHandler(event)}
                >
                  {token}
                </span>
              ))
            : line.map((token, index) => <span key={index}>{token}</span>)}
        </div>
      ))}
    </div>
  );
};
