import mirador from "mirador";
import React from "react";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useMiradorStore } from "../../stores/mirador";
import { useProjectStore } from "../../stores/project";

interface TextHighlightingProps {
  text: BroccoliTextGeneric;
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  const miradorStore = useMiradorStore((state) => state.miradorStore);
  const projectName = useProjectStore((state) => state.projectName);
  const currentSelectedAnn = useAnnotationStore(
    (state) => state.currentSelectedAnn,
  );
  const openAnnos = useAnnotationStore((state) => state.openAnn);

  const classes = new Map<number, string[]>();

  const textLinesToDisplay: string[][] = [[]];

  props.text.lines.map((token) => {
    if (token.charAt(0) === "\n") {
      textLinesToDisplay.push([]);
    }
    textLinesToDisplay[textLinesToDisplay.length - 1].push(token);
  });

  if (props.text.locations) {
    props.text.locations.annotations.forEach((it) => {
      for (let i = it.start.line; i <= it.end.line; i++) {
        if (classes.has(i)) {
          classes.get(i)?.push(it.bodyId);
        } else {
          classes.set(i, [it.bodyId]);
        }
      }
    });
  }

  if (currentSelectedAnn) {
    const parentDOM = document.getElementById("textcontainer");
    if (parentDOM) {
      const target = parentDOM.getElementsByClassName(
        `${currentSelectedAnn}`,
      )[0];

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  let offset = 0;

  function doOffset(length: number) {
    offset = offset + length;
  }

  function collectClasses(index: number) {
    const collectedClasses = new Set<string>();
    if (props.highlightedLines.includes(index)) {
      openAnnos.map((openAnn) => {
        const indexClasses = classes.get(index);
        if (indexClasses?.includes(openAnn.bodyId)) {
          indexClasses.forEach((indexClass) =>
            collectedClasses.add(indexClass),
          );
          collectedClasses.add("highlighted");
        }
      });
    } else {
      const indexClass = classes.get(index);
      if (typeof indexClass === "object") {
        collectedClasses.add(indexClass.join(" "));
      }
    }

    let classesAsStr = "";

    collectedClasses.forEach(
      (it: string) => (classesAsStr = classesAsStr.concat(it) + " "),
    );

    return classesAsStr;
  }

  function selectAnn(event: React.MouseEvent<HTMLSpanElement>) {
    const className = event.currentTarget.className;
    const matches = className.match(/[^ ]*textline[^ ]*/);

    if (matches) {
      matches.forEach((match) => {
        miradorStore.dispatch(
          mirador.actions.selectAnnotation(projectName, match),
        );
      });
    }
  }

  function deselectAnn(event: React.MouseEvent<HTMLSpanElement>) {
    const className = event.currentTarget.className;
    const matches = className.match(/[^ ]*textline[^ ]*/);

    if (matches) {
      matches.forEach((match) => {
        miradorStore.dispatch(
          mirador.actions.deselectAnnotation(projectName, match),
        );
      });
    }
  }

  return (
    <div id="textcontainer">
      {textLinesToDisplay.map((line, key) => (
        <div key={key} className={`grid leading-loose`}>
          {classes.size >= 1
            ? line.map((token, index) => (
                <span
                  key={index}
                  className={collectClasses(index + offset)}
                  onMouseEnter={(event) => selectAnn(event)}
                  onMouseLeave={(event) => deselectAnn(event)}
                >
                  {token}
                </span>
              ))
            : line.map((token, index) => <span key={index}>{token}</span>)}
          {doOffset(line.length)}
        </div>
      ))}
    </div>
  );
}
