import React from "react";

interface TextHighlightingProps {
  text: string[];
  highlightedLines: number[];
}

export function TextHighlighting(props: TextHighlightingProps) {
  return (
    <div>
      {props.text.map((line, index) => (
        <p
          key={index}
          className={
            props.highlightedLines.includes(index) ? "highlighted" : ""
          }
        >
          {line}
        </p>
      ))}
    </div>
  );
}
