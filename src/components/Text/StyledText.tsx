import { forwardRef, PropsWithChildren } from "react";

export const StyledText = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    panel: string;
  }>
>(function StyledText(props, ref) {
  return (
    <div
      id={props.panel}
      ref={ref}
      className="flex w-full flex-col border-t border-neutral-200 px-6 pb-8 pt-8 font-serif text-lg lg:px-10"
    >
      {props.children}
    </div>
  );
});
