import React from "react";
import {
  AnnoRepoAnnotation,
  LogicalTextAnchorTarget,
  Target,
} from "../../model/AnnoRepoAnnotation";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useAnnotationStore } from "../../stores/annotation";

type LogicalTextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const LogicalTextHighlighting = (
  props: LogicalTextHighlightingProps,
) => {
  const annotations = useAnnotationStore((state) => state.annotations);
  // const projectName = useProjectStore((state) => state.projectName);
  const classes = new Map<number, string[]>();
  // const textToHighlight = useSearchStore((state) => state.textToHighlight);
  // const params = useParams();
  const [annotationsToHighlight, setAnnotationsToHighlight] = React.useState<
    AnnoRepoAnnotation[]
  >([]);
  const annotationTypesToHighlight = useAnnotationStore(
    (state) => state.annotationTypesToHighlight,
  );

  const textLinesToDisplay: string[][] = [[]];

  React.useEffect(() => {
    const filteredAnnotations: AnnoRepoAnnotation[] = [];
    annotationTypesToHighlight.forEach((annotationType) => {
      const annotationsOfType = annotations.filter(
        (annotation) => annotation.body.type === annotationType,
      );
      filteredAnnotations.push(...annotationsOfType);
    });

    console.log(filteredAnnotations);

    filteredAnnotations.sort((a, b) => {
      const aLogicalTextTargets = (a.target as Target[]).filter(
        (target) => target.type === "LogicalText",
      );
      const bLogicalTextTargets = (b.target as Target[]).filter(
        (target) => target.type === "LogicalText",
      );

      return (
        (aLogicalTextTargets[0] as LogicalTextAnchorTarget).selector
          .beginCharOffset -
        (bLogicalTextTargets[0] as LogicalTextAnchorTarget).selector
          .endCharOffset
      );
    });

    setAnnotationsToHighlight(filteredAnnotations);
  }, [annotations, annotationTypesToHighlight]);

  console.log(annotationsToHighlight);

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

  function renderLines(line: string, index: number) {
    const result: React.ReactNode[] = [];
    let currentIndex = 0;

    if (annotationsToHighlight.length > 0) {
      annotationsToHighlight.map((annoToHighlight, key) => {
        const logicalTextTargets = (annoToHighlight.target as Target[]).filter(
          (target) => target.type === "LogicalText",
        );

        const beginCharOffset = (
          logicalTextTargets[0] as LogicalTextAnchorTarget
        ).selector.beginCharOffset;

        const endCharOffset = (logicalTextTargets[0] as LogicalTextAnchorTarget)
          .selector.endCharOffset;

        const indexClasses = classes.get(index);
        console.log(indexClasses);
        if (indexClasses?.includes(annoToHighlight.body.id)) {
          result.push(
            <span key={`text-${key}`}>
              {line.substring(currentIndex, beginCharOffset)}
            </span>,
          );
          result.push(
            <span key={`underline-${key}`} className="underlined-attendant">
              {line.substring(beginCharOffset, endCharOffset + 1)}
            </span>,
          );
          currentIndex = endCharOffset + 1;
        }
      });

      result.push(
        <span key={`text-remaining`}>{line.substring(currentIndex)}</span>,
      );

      console.log(result);

      return result;
    } else {
      result.push(line);
      return result;
    }

    // if (textToHighlight.size > 0 && params.tier2) {
    //   if (textToHighlight.get(params.tier2)) {
    //     const toHighlightStrings = textToHighlight.get(params.tier2);
    //     const regexString = toHighlightStrings
    //       ?.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    //       .join("|");
    //     const regex = new RegExp(`${regexString}`, "g");

    //     projectName === "republic" || projectName === "globalise"
    //       ? (result = (
    //           <div
    //             // className={collectClasses(index) + "w-fit"}
    //             dangerouslySetInnerHTML={{
    //               __html: line.replace(
    //                 regex,
    //                 '<span class="rounded bg-yellow-200 p-1">$&</span>',
    //               ),
    //             }}
    //           />
    //         ))
    //       : (result = (
    //           <span
    //             // className={collectClasses(index) + "w-fit"}
    //             dangerouslySetInnerHTML={{
    //               __html: line.replace(
    //                 regex,
    //                 '<span class="rounded bg-yellow-200 p-1">$&</span>',
    //               ),
    //             }}
    //           />
    //         ));
    //   }
    //   return result;
    // } else {
    //   if (projectName === "republic" || projectName === "globalise") {
    //     return (
    //       // <p className={collectClasses(index) + "m-0 p-0"}>{line}</p>
    //       <p>{line}</p>
    //     );
    //   } else {
    //     return (
    //       // <span className={collectClasses(index)}>{line}</span>
    //       <span>{line}</span>
    //     );
    //   }
    // }
  }

  return (
    <>
      {textLinesToDisplay.map((lines, key) => (
        <div key={key} className="leading-loose">
          {lines.map((line, index) => renderLines(line, index))}
          {/* Index is reset after each new line (see LL40-45 above). This results in the index no longer being in sync with the start and end of TextRepo. I.e., a person is mentioned on start 9, end 9, it will highlight index 9, even though the index of that array was reset because of a preceding new line. */}
        </div>
      ))}
    </>
  );
};
