import { PropsWithChildren } from "react";

export function AnnotationLink(
  props: PropsWithChildren<{ url: string; className?: string }>,
) {
  const { url, className, children } = props;
  return (
    <span
      className={className}
      role="link"
      tabIndex={0}
      onClick={() => window.open(url, "_blank")}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          window.open(url, "_blank");
        }
      }}
    >
      {children}
    </span>
  );
}
