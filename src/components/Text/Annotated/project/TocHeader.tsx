import { tocScrollHeader } from "../../Toc/useSyncHeaderOnScroll.tsx";
import { ReactNode } from "react";

type TocHeaderSpanProps = {
  id: string;
  className: string;
  children: ReactNode;
};

export function TocHeader({ id, className, children }: TocHeaderSpanProps) {
  return (
    <span id={id} className={[className, tocScrollHeader].join(" ")}>
      {children}
    </span>
  );
}
