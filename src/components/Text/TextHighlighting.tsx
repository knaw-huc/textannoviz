import React from "react";
import { useParams } from "react-router-dom";
import { useProjectStore } from "../../stores/project";

interface TextHighlightingProps {
  text: string[];
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  const projectName = useProjectStore((state) => state.projectName);
  const params = useParams();

  React.useEffect(() => {
    if (props.highlightedLines.length >= 1 && !params.tier2) {
      const parentDOM = document.getElementById("textcontainer");
      const target = parentDOM.getElementsByClassName("highlighted")[0];
      console.log(parentDOM.getElementsByClassName("highlighted"));
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [params.tier2, props.highlightedLines.length]);

  return (
    <div
      style={projectName === "republic" ? { display: "grid" } : null}
      id="textcontainer"
    >
      {props.text.map((line, index) => (
        <span
          key={index}
          className={
            props.highlightedLines.includes(index) ? "highlighted" : ""
          }
        >
          {line}
        </span>
      ))}
    </div>
  );
}
