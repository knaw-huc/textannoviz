import React from "react";

interface TextHighlightingProps {
  text: string[];
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  return (
    <div style={{ display: "grid" }}>
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
