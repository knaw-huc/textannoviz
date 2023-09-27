import { useParams } from "react-router-dom";
import { BroccoliTextGeneric } from "../../model/Broccoli";
import { useProjectStore } from "../../stores/project";
import { useSearchStore } from "../../stores/search";

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

  function highlightMatches(text: string) {
    let result = <p className="m-0 p-0">{text}</p>;

    if (textToHighlight && params.tier2) {
      if (textToHighlight.get(params.tier2)) {
        const toHighlightStrings = textToHighlight.get(params.tier2);
        const regexString = toHighlightStrings
          ?.map((string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|");
        const regex = new RegExp(`${regexString}`, "g");

        console.log(regex.toString());
        console.log(regexString);

        result = (
          <div
            dangerouslySetInnerHTML={{
              __html: text.replace(
                regex,
                '<span class="rounded bg-yellow-200 p-1">$&</span>',
              ),
            }}
          />
        );
      }
      return result;
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
