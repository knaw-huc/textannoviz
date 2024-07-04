import { PropsWithChildren } from "react";

export function StyledText(props: PropsWithChildren<{ panel: string }>) {
  return (
    <div
      id={props.panel}
      className="prose border-brand1Grey-100 mx-auto w-full max-w-full overflow-auto border-x border-y p-3 font-serif text-lg"
    >
      {props.children}
    </div>
  );
}
