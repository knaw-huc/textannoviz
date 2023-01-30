import React from "react";
import { projectContext } from "../../state/project/ProjectContext";

interface TextHighlightingProps {
  text: string[];
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  const { projectState } = React.useContext(projectContext);

  return (
    <div
      style={projectState.project === "republic" ? { display: "grid" } : null}
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
