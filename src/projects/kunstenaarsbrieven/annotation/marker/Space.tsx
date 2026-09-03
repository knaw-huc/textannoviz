import { WhitespaceBody } from "../ProjectAnnotationModel.ts";

export function Space(props: { body: WhitespaceBody }) {
  const { body } = props;
  const unit = body["tei:unit"] === "chars" ? "ch" : "em";
  const width = `${body["tei:quantity"] ?? 0}${unit}`;
  return <span className="insert-marker space" style={{ width }} />;
}
