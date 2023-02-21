import React from "react";
import { projectContext } from "../../state/project/ProjectContext";

interface TextHighlightingProps {
  text: string[];
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  const { projectState } = React.useContext(projectContext);

  React.useEffect(() => {
    if (props.highlightedLines.length > 1) {
      console.log("lines is more than 1");
      const parentDOM = document.getElementById("textcontainer");
      const target = parentDOM.getElementsByClassName("highlighted")[0];
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.highlightedLines.length]);

  return (
    <div
      style={projectState.project === "republic" ? { display: "grid" } : null}
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
