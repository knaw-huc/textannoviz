import { PropsWithChildren } from "react";

export function StyledText(props: PropsWithChildren<{ panel: string }>) {
  return (
    <div
      id={props.panel}
      className="flex w-full flex-col border-t border-neutral-200 px-6 pb-8 pt-8 font-serif text-lg lg:px-10"
    >
      {props.children}
    </div>
  );
}
