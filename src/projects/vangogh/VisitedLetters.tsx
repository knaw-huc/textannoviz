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

export const VisitedLetters = () => {
  const translateProject = useTranslateProject();

  return (
    <div
      className="letter-nav__recent flex gap-2 tracking-wide text-neutral-800"
      aria-label={translateProject("VISITED_LETTERS")}
    >
      <span className="sr-only">{translateProject("VISITED_LETTERS")}</span>
      {visitedLetters.map((letter) => (
        <LetterNumber key={letter}>{letter}</LetterNumber>
      ))}
    </div>
  );
};
