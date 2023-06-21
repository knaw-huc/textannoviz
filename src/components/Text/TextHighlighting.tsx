import { useParams } from "react-router-dom";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";
import { useProjectStore } from "../../stores/project";

interface TextHighlightingProps {
  text: BroccoliTextGeneric;
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  const projectName = useProjectStore((state) => state.projectName);
  const currentSelectedAnn = useAnnotationStore(
    (state) => state.currentSelectedAnn
  );
  const params = useParams();

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

  if (currentSelectedAnn && !params.tier2) {
    const parentDOM = document.getElementById("textcontainer");
    if (parentDOM) {
      const target = parentDOM.getElementsByClassName(
        `${currentSelectedAnn}`
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

  return (
    <div id="textcontainer">
      {textLinesToDisplay.map((line, key) => (
        <div key={key} className={`textLines-${projectName}`}>
          {classes.size >= 1
            ? line.map((token, index) => (
                <span
                  key={index}
                  className={
                    props.highlightedLines.includes(index + offset)
                      ? classes
                          .get(index + offset)
                          ?.includes(currentSelectedAnn)
                        ? classes.get(index + offset)?.join(" ") +
                          " highlighted"
                        : classes.get(index + offset)?.join(" ")
                      : classes.get(index + offset) &&
                        classes.get(index + offset)?.join(" ")
                  }
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
