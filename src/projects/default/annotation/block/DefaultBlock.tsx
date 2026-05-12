import { BlockProps } from "../../../../components/Text/Annotated/core/AnnotatedText.tsx";

export function DefaultBlock(props: BlockProps) {
  return <span data-type={props.block}>{props.children}</span>;
}
