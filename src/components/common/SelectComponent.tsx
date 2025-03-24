import { CheckIcon } from "@heroicons/react/16/solid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import type { ListBoxItemProps, SelectProps } from "react-aria-components";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

import { HelpTooltip } from "./HelpTooltip.tsx";

interface SelectComponentProps<T extends object>
  extends Omit<SelectProps<T>, "children"> {
  label?: string;
  helpLabel?: string;
  items?: Iterable<T>;
  buttonWidth?: string;
  labelStyling?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function SelectComponent<T extends object>({
  label,
  helpLabel,
  children,
  items,
  buttonWidth,
  labelStyling,
  ...props
}: SelectComponentProps<T>) {
  return (
    <Select {...props} className="flex flex-row items-center justify-between">
      <Label
        className={`${labelStyling ? labelStyling : "mr-1 font-semibold"}`}
      >
        {label}
        <HelpTooltip label={helpLabel} />
      </Label>
      <Button
        className={`${
          buttonWidth ? buttonWidth : "w-[150px]"
        } border-brand1Grey-700 flex cursor-default items-center justify-between rounded border bg-white px-2 py-1 text-sm`}
      >
        <SelectValue className="truncate" />
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
      <Popover className="max-h-60 w-[--trigger-width] overflow-auto rounded bg-white text-sm shadow-lg ring-1 ring-black/15">
        <ListBox className="p-1 outline-none" items={items}>
          {children}
        </ListBox>
      </Popover>
    </Select>
  );
}

export function SelectItemComponent(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className="focus:bg-brand2-600 group flex cursor-default select-none items-center gap-2 rounded px-4 py-2 outline-none focus:text-white"
    >
      {({ isSelected }) => (
        <>
          <span className="flex flex-1 items-center gap-2">
            {props.children}
          </span>
          <span className="flex w-5 items-center group-focus:text-white">
            {isSelected && <CheckIcon className="h-5 w-5" />}
          </span>
        </>
      )}
    </ListBoxItem>
  );
}
