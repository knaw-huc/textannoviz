import { CheckIcon } from "@heroicons/react/16/solid";
import React from "react";
import type { CheckboxGroupProps, CheckboxProps } from "react-aria-components";
import { Button, Checkbox, CheckboxGroup, Label } from "react-aria-components";
import { HelpTooltip } from "./HelpTooltip.tsx";
import { SortAlphaAscIcon } from "./icons/SortAlphaAscIcon";
import { SortAlphaDescIcon } from "./icons/SortAlphaDescIcon";
import { SortNumDescIcon } from "./icons/SortNumDescIcon";
import {
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";

interface CheckboxGroupComponentProps
  extends Omit<CheckboxGroupProps, "children"> {
  children?: React.ReactNode;
  translatedLabel?: string;
  helpLabel?: string;
  dataLabel: string;
  sortIconClickHandler: (agg: string, order: string) => void;
  facetLength: number;
  sortOrder: string | undefined;
}

type SortOrder = "countDesc" | "keyAsc" | "keyDesc";
export function CheckboxGroupComponent({
  translatedLabel,
  helpLabel,
  dataLabel,
  children,
  ...props
}: CheckboxGroupComponentProps) {
  const translateProject = useProjectStore(translateProjectSelector);
  function sortIconClickHandler(agg: string, order: SortOrder) {
    if (props.sortOrder === order) return;

    props.sortIconClickHandler(agg, order);
  }

  return (
    <CheckboxGroup
      {...props}
      className="bg-brand2-50 relative flex flex-col gap-2 rounded pb-2"
    >
      <>
        <div className="border-brand2-100 bg-brand2-100 sticky top-0 z-10 flex h-12 flex-col items-start rounded-t border-b-2">
          <div className="flex h-12 w-full flex-row items-center pr-2">
            <Label className="w-full pl-3 font-semibold">
              {translatedLabel}
              <HelpTooltip label={helpLabel} />
            </Label>
            <div className="flex flex-row gap-1">
              <Button
                onPress={() => sortIconClickHandler(dataLabel, "keyAsc")}
                aria-label={translateProject("SORT_FACET_ITEMS_AZ")}
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
                aria-label={translateProject("SORT_FACET_ITEMS_ZA")}
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
                aria-label={translateProject("SORT_FACET_ITEMS_COUNT")}
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
  onChange: () => void;
  children?: React.ReactNode;
}

export function CheckboxComponent(props: CheckboxComponentProps) {
  const { children, isSelected } = props;
  return (
    <Checkbox
      isSelected={isSelected}
      className="group flex items-center gap-2 pb-1 pl-2 pt-1 transition"
      onChange={props.onChange}
    >
      <div
        aria-label="filter on "
        className={`${
          isSelected ? "bg-brand2-600 border-brand2-600" : ""
        } flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition`}
      >
        {isSelected && <CheckIcon className="h-5 w-5 text-white" />}
      </div>
      {children}
    </Checkbox>
  );
}
