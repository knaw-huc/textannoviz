import { useParams } from "react-router-dom";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useProjectStore } from "../../stores/project";
import { useSearchStore } from "../../stores/search/search-store";

type TextHighlightingProps = {
  text: BroccoliTextGeneric;
};

export const TextHighlighting = (props: TextHighlightingProps) => {
  const textToHighlight = useSearchStore((state) => state.textToHighlight);

  const projectName = useProjectStore((state) => state.projectName);

  const textLinesToDisplay: string[][] = [[]];

  const params = useParams();

  props.text.lines.map((token) => {
    if (token.charAt(0) === "\n") {
      textLinesToDisplay.push([]);
    }
    textLinesToDisplay[textLinesToDisplay.length - 1].push(token);
  });

  console.log(Math.random().toString().slice(2));

  function highlightMatches(text: string) {
    let result = (
      <span key={Math.random().toString().slice(2)} className="m-0 p-0">
        {text}
      </span>
    );

    if (textToHighlight.size > 0 && params.tier2) {
      if (textToHighlight.get(params.tier2)) {
        const toHighlightStrings = textToHighlight.get(params.tier2);
        const regexString = toHighlightStrings
          ?.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|");
        const regex = new RegExp(`${regexString}`, "g");

        projectName === "republic"
          ? (result = (
              <div
                dangerouslySetInnerHTML={{
                  __html: text.replace(
                    regex,
                    '<span class="rounded bg-yellow-200 p-1">$&</span>',
                  ),
                }}
              />
            ))
          : (result = (
              <span
                dangerouslySetInnerHTML={{
                  __html: text.replace(
                    regex,
                    '<span class="rounded bg-yellow-200 p-1">$&</span>',
                  ),
                }}
              />
            ));
      }
      return result;
    } else {
      if (projectName === "republic") {
        return <p className="m-0 p-0">{text}</p>;
      } else {
        return <span key={Math.random().toString().slice(2)}>{text}</span>;
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
