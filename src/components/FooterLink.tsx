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
  const textClasses = ["text-inherit", "no-underline"];
  if (props.disabled) {
    btnClasses.push("text-neutral-300");
  } else {
    btnClasses.push("text-neutral-500");
    textClasses.push("hover:text-brand1-600", "active:text-brand1-700");
  }

  return (
    <Button
      isDisabled={props.disabled}
      className={btnClasses.join(" ")}
      onPress={props.onClick}
    >
      <span aria-disabled={props.disabled} className={textClasses.join(" ")}>
        {props.children}
      </span>
    </Button>
  );
}
