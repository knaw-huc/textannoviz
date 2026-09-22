import { Link } from "react-aria-components";
import { useTranslateProject } from "../../stores/project.ts";
import { LetterNumber } from "../kunstenaarsbrieven/LetterNumber.tsx";

/** Static placeholder list of recently visited letter numbers. */
const visitedLetters = [
  "042",
  "187",
  "501",
  "319",
  "088",
  "654",
] as const;

function historyBackgroundOpacity(index: number): number {
  if (index < 3) return 1;
  return Math.max(0.3, 1 - (index - 2) * 0.22);
}

export const VisitedLetters = () => {
  const translateProject = useTranslateProject();

  return (
    <div
      className="min-w-0 max-w-[500px] overflow-x-auto max-lg:flex-1 max-lg:basis-0 lg:border-l lg:border-neutral-200 lg:pl-3"
      aria-label={translateProject("VISITED_LETTERS")}
    >
      <span className="sr-only">{translateProject("VISITED_LETTERS")}</span>
      <div className="flex w-max gap-2 py-3 tracking-wide text-neutral-800">
        {visitedLetters.map((letter, index) => (
          <Link
            key={letter}
            href="#"
            aria-label={`${translateProject("VISITED_LETTER")} ${letter}`}
            className="text-inherit no-underline outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-1"
          >
            <LetterNumber backgroundOpacity={historyBackgroundOpacity(index)}>
              {letter}
            </LetterNumber>
          </Link>
        ))}
      </div>
    </div>
  );
};
