import { PropsWithChildren } from "react";
import { Button } from "react-aria-components";

export function FooterLink(
  props: PropsWithChildren<{
    classes?: string[];
    onClick: () => void;
    disabled?: boolean;
  }>,
) {
  const btnClasses = ["flex", "flex-row", "items-center", "gap-1", "py-1"];
  if (props.classes) {
    btnClasses.push(...props.classes);
  }
  if (props.disabled) {
    btnClasses.push("text-neutral-300");
  }

  return (
    <Button
      isDisabled={props.disabled}
      className={btnClasses.join(" ")}
      onPress={props.onClick}
    >
      <span aria-disabled={props.disabled}>{props.children}</span>
    </Button>
  );
}
