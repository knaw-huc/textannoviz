import React from "react";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useProjectStore } from "../../stores/project";
import { useSearchStore } from "../../stores/search";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const TextHighlighting = (props: TextHighlightingProps) => {
  const globalSearchQuery = useSearchStore((state) => state.globalSearchQuery);
  const textToHighlight = useSearchStore((state) => state.textToHighlight);

  const projectName = useProjectStore((state) => state.projectName);

  const textLinesToDisplay: string[][] = [[]];

  props.text.lines.map((token) => {
    if (token.charAt(0) === "\n") {
      textLinesToDisplay.push([]);
    }
    textLinesToDisplay[textLinesToDisplay.length - 1].push(token);
  });

  function highlightMatches(text: string) {
    if (textToHighlight) {
      console.log(textToHighlight);
      for (const subStrings of textToHighlight) {
        console.log(subStrings);
        if (subStrings) {
          for (const subString of subStrings) {
            console.log(subString);
            const regex = new RegExp(subString, "g");
            const parts = text.split(regex);
            const matches = text.match(regex);

            // console.log(matches);

            if (!matches) {
              return <p className="m-0 p-0">{text}</p>;
            }

            return (
              <>
                {parts.map((part, index) => (
                  <React.Fragment key={index}>
                    <>{part}</>
                    {index < matches.length && (
                      <span className="rounded bg-yellow-200 p-1">
                        {matches[index]}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </>
            );
          }
        }
      }

      // const regex = new RegExp(globalSearchQuery.text!, "gi");
      // const parts = text.split(regex);
      // const matches = text.match(regex);

      // if (!matches) {
      //   return <p className="m-0 p-0">{text}</p>;
      // }

      // return (
      //   <>
      //     {parts.map((part, index) => (
      //       <React.Fragment key={index}>
      //         <>{part}</>
      //         {index < matches.length && (
      //           <span className="rounded bg-yellow-200 p-1">
      //             {matches[index]}
      //           </span>
      //         )}
      //       </React.Fragment>
      //     ))}
      //   </>
      // );
    } else {
      if (projectName === "republic") {
        return <p className="m-0 p-0">{text}</p>;
      } else {
        return <span>{text}</span>;
      }
    }
  }

  return (
    <>
      {textLinesToDisplay.map((lines, index) => (
        <div key={index} className="leading-loose">
          {lines.map((line) => highlightMatches(line))}
        </div>
      ))}
    </>
  );
};
