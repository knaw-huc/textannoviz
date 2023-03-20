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

  props.text.locations.annotations.forEach((it) => {
    for (let i = it.start.line; i <= it.end.line; i++) {
      if (classes.has(i)) {
        classes.get(i).push(it.bodyId);
      } else {
        classes.set(i, [it.bodyId]);
      }
    }
  });

  if (currentSelectedAnn && !params.tier2) {
    console.log("scroll into view");
    const parentDOM = document.getElementById("textcontainer");
    const target = parentDOM.getElementsByClassName(`${currentSelectedAnn}`)[0];
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div
      style={projectName === "republic" ? { display: "grid" } : null}
      id="textcontainer"
    >
      {props.text.lines.map((line, index) => (
        <span
          key={index}
          className={
            props.highlightedLines.includes(index)
              ? classes.get(index).join(" ") + " highlighted"
              : classes.get(index).join(" ")
          }
        >
          {line}
        </span>
      ))}
    </div>
  );
}
