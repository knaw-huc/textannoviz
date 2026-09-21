import type { ReactNode } from "react";

export const letterNumberClassName =
  "rounded-sm bg-[#EDE8D3] px-2 py-1 text-xs tabular-nums";

type LetterNumberProps = {
  children: ReactNode;
};

export const LetterNumber = ({ children }: LetterNumberProps) => (
  <span className={letterNumberClassName}>{children}</span>
);
