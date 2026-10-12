import { tocScrollHeader } from "../../../../components/Text/Toc/useSyncHeaderOnScroll.tsx";
import { ComponentProps } from "react";

type TocHeaderSpanProps = ComponentProps<"span"> & {
  id: string;
  className: string;
};

export function TocHeader({ className, ...props }: TocHeaderSpanProps) {
  return <span {...props} className={[className, tocScrollHeader].join(" ")} />;
}
