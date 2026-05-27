import React from "react";
import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuProps,
  type MenuItemProps,
  MenuTrigger as AriaMenuTrigger,
  SubmenuTrigger as AriaSubmenuTrigger,
  type SubmenuTriggerProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  Popover,
  type PopoverProps,
} from "react-aria-components/Menu";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { ChevronRight } from "./icons/ChevronRight";

// Adapted from https://react-aria.adobe.com/Menu

export function Menu<T extends object>(props: MenuProps<T>) {
  return <AriaMenu {...props} />;
}

export function MenuItem(props: MenuItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <AriaMenuItem textValue={textValue} {...props}>
      {composeRenderProps(
        props.children,
        (children, { selectionMode, isSelected, hasSubmenu }) => (
          <>
            {selectionMode !== "none" && (
              <span className="flex w-4 items-center">
                {isSelected && <ChevronRight aria-hidden />}
              </span>
            )}
            <span className="group-selected:font-semibold flex flex-1">
              {children}
            </span>
            {hasSubmenu && <ChevronRight aria-hidden className="opacity-60" />}
          </>
        ),
      )}
    </AriaMenuItem>
  );
}

interface MenuTriggerProps extends AriaMenuTriggerProps {
  placement?: PopoverProps["placement"];
}

export function MenuTrigger(props: MenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaMenuTrigger {...props}>
      {trigger}
      <Popover
        placement={props.placement}
        offset={14}
        className="min-w-[150px]"
      >
        {menu}
      </Popover>
    </AriaMenuTrigger>
  );
}

export function SubmenuTrigger(props: SubmenuTriggerProps) {
  const [trigger, menu] = React.Children.toArray(props.children) as [
    React.ReactElement,
    React.ReactElement,
  ];
  return (
    <AriaSubmenuTrigger {...props}>
      {trigger}
      <Popover offset={-2} crossOffset={-4}>
        {menu}
      </Popover>
    </AriaSubmenuTrigger>
  );
}
