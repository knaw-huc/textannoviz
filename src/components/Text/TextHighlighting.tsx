import React from "react";
import { annotationContext } from "../../state/annotation/AnnotationContext";
import { textContext } from "../../state/text/TextContext";

export function TextHighlighting() {
  const { annotationState } = React.useContext(annotationContext);
  const { textState } = React.useContext(textContext);

  const [textToMark, setTextToMark] = React.useState(textState.text.lines);
  console.log("text component begins");

  React.useEffect(() => {
    if (annotationState.annotationItemOpen === true) {
      console.log("IF STATEMENT TRUE");
      console.log(textState.textToHighlight);
      const markElement = `<mark>${textToMark
        .slice(
          textState.textToHighlight.location.start.line,
          textState.textToHighlight.location.end.line + 1
        )
        .join("\n")}</mark>`;
      console.log(markElement);
      textToMark.splice(
        textState.textToHighlight.location.start.line,
        textState.textToHighlight.location.end.offset,
        markElement
      );
      console.log(textToMark);
    } else {
      setTextToMark(textState.text.lines);
      console.log("IF IS FALSE");
      console.log(textToMark);
      console.log(textState.text);
    }
  }, [annotationState.annotationItemOpen, textState.text]);

  //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
  return <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />;
}
