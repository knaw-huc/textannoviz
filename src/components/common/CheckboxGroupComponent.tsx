import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";
import type { CheckboxGroupProps, CheckboxProps } from "react-aria-components";
import { Button, Checkbox, CheckboxGroup, Label } from "react-aria-components";
import { SortAlphaAscIcon } from "./icons/SortAlphaAscIcon";
import { SortAlphaDescIcon } from "./icons/SortAlphaDescIcon";
import { SortNumDescIcon } from "./icons/SortNumDescIcon";

interface CheckboxGroupComponentProps
  extends Omit<CheckboxGroupProps, "children"> {
  children?: React.ReactNode;
  translatedLabel?: string;
  dataLabel: string;
  sortIconClickHandler: (agg: string, order: string) => void;
  facetLength: number;
  sortOrder: string | undefined;
}

type SortOrder = "countDesc" | "keyAsc" | "keyDesc";

export function CheckboxGroupComponent({
  translatedLabel,
  dataLabel,
  children,
  ...props
}: CheckboxGroupComponentProps) {
  function sortIconClickHandler(agg: string, order: SortOrder) {
    if (props.sortOrder === order) return;

    props.sortIconClickHandler(agg, order);
  }

  return (
    <CheckboxGroup
      {...props}
      className="bg-brand2-50 flex flex-col gap-2 rounded pb-2"
    >
      <>
        <div className="border-brand2-100 bg-brand2-100 flex h-12 flex-col items-start rounded-t border-b-2">
          <div className="flex h-12 w-full flex-row items-center pr-2">
            <Label className="w-full pl-3 font-semibold">
              {translatedLabel}
            </Label>
            <div className="flex flex-row gap-1">
              <Button
                onPress={() => sortIconClickHandler(dataLabel, "keyAsc")}
                className={`${
                  props.sortOrder === "keyAsc"
                    ? "fill-black"
                    : "fill-brand2-500"
                } outline-none transition hover:fill-black`}
              >
                <SortAlphaAscIcon />
              </Button>
              <span className="text-brand2-400 text-2xl"> | </span>
              <Button
                onPress={() => sortIconClickHandler(dataLabel, "keyDesc")}
                className={`${
                  props.sortOrder === "keyDesc"
                    ? "fill-black"
                    : "fill-brand2-500"
                } outline-none transition hover:fill-black`}
              >
                <SortAlphaDescIcon />
              </Button>
              <span className="text-brand2-400 text-2xl"> | </span>
              <Button
                onPress={() => sortIconClickHandler(dataLabel, "countDesc")}
                className={`${
                  props.sortOrder === "countDesc"
                    ? "fill-black"
                    : "fill-brand2-500"
                } outline-none transition hover:fill-black`}
              >
                <SortNumDescIcon />
              </Button>
            </div>
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
