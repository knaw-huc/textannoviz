import type { ReactNode } from "react";

/** #EDE8D3 as RGB — used so background alpha can fade without dimming text. */
const LETTER_NUMBER_BG_RGB = "237, 232, 211";

export const letterNumberClassName =
  "rounded-sm px-2 py-1 text-xs tabular-nums";

type LetterNumberProps = {
  children: ReactNode;
  /** Background opacity only (1 = solid). Text stays fully opaque for contrast. */
  backgroundOpacity?: number;
};

export const LetterNumber = ({
  children,
  backgroundOpacity = 1,
}: LetterNumberProps) => (
  <span
    className={letterNumberClassName}
    style={{
      backgroundColor: `rgba(${LETTER_NUMBER_BG_RGB}, ${backgroundOpacity})`,
    }}
  >
    {children}
  </span>
);
