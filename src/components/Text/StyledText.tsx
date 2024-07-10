import { PropsWithChildren } from "react";

export function StyledText(props: PropsWithChildren<{ panel: string }>) {
  return (
    <div
      id={props.panel}
      className="w-full border-t border-neutral-200 px-4 py-8 font-serif text-lg"
    >
      {props.children}
    </div>
  );
}
