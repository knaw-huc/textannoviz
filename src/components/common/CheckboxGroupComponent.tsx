import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";
import type { CheckboxGroupProps, CheckboxProps } from "react-aria-components";
import { Button, Checkbox, CheckboxGroup, Label } from "react-aria-components";
import { SortAlphaAscIcon } from "./icons/SortAlphaAscIcon";

interface CheckboxGroupComponentProps
  extends Omit<CheckboxGroupProps, "children"> {
  children?: React.ReactNode;
  translatedLabel?: string;
  dataLabel?: string;
}

export function CheckboxGroupComponent({
  translatedLabel,
  dataLabel,
  children,
  ...props
}: CheckboxGroupComponentProps) {
  console.log(translatedLabel);
  console.log(dataLabel);

  return (
    <CheckboxGroup
      {...props}
      className="bg-brand2-50 flex flex-col gap-2 rounded pb-2"
    >
      <>
        <div className="border-brand2-100 flex h-12 flex-col items-start rounded-t border-b-2 bg-[hsl(195,30%,94%)]">
          <div className="flex h-12 w-full flex-row items-center pr-2">
            <Label className="w-full pl-3 font-semibold">
              {translatedLabel}
            </Label>
            <Button className="fill-black outline-none transition hover:fill-black">
              <SortAlphaAscIcon />
            </Button>
          </div>
        </div>
        {children}
      </>
    </CheckboxGroup>
  );
}

interface CheckboxComponentProps extends Omit<CheckboxProps, "children"> {
  children?: React.ReactNode;
}

export function CheckboxComponent({
  children,
  ...props
}: CheckboxComponentProps) {
  return (
    <Checkbox
      {...props}
      className="group flex items-center gap-2 pb-1 pl-2 pt-1 transition"
    >
      {({ isSelected }) => (
        <>
          <div
            className={`${
              isSelected ? "bg-brand2-600 border-brand2-600" : ""
            } flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition`}
          >
            {isSelected ? <CheckIcon className="h-5 w-5 text-white" /> : null}
          </div>
          {children}
        </>
      )}
    </Checkbox>
  );
}
