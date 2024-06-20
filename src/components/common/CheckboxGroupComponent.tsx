import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";
import type { CheckboxGroupProps, CheckboxProps } from "react-aria-components";
import { Checkbox, CheckboxGroup, Label } from "react-aria-components";

interface CheckboxGroupComponentProps
  extends Omit<CheckboxGroupProps, "children"> {
  children?: React.ReactNode;
  label?: string;
}

export function CheckboxGroupComponent({
  label,
  children,
  ...props
}: CheckboxGroupComponentProps) {
  return (
    <CheckboxGroup {...props} className="flex flex-col gap-2">
      <Label className="font-semibold" tabIndex={0}>
        {label}
      </Label>
      {children}
      <div className="sr-only">
        <a href="#resultsList">Jump to search results</a>
      </div>
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
    <Checkbox {...props} className="group flex items-center gap-2 transition">
      {({ isSelected }) => (
        <>
          <div
            aria-label="filter on "
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
