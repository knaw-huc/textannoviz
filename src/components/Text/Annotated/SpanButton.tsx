import { ElementType, PropsWithChildren, useRef } from "react";
import { AriaButtonOptions } from "@react-aria/button";
import { useButton } from "react-aria";

export function SpanButton(
  props: PropsWithChildren<AriaButtonOptions<ElementType>>,
) {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  return (
    <span
      {...buttonProps}
      ref={ref}
      // @ts-expect-error useButton should not add type="button"
      type={undefined}
    >
      {children}
    </span>
  );
}
