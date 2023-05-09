import styled from "styled-components";
import { useTextStore } from "../../stores/text";
import { TextComponent } from "./TextComponent";

const TextStyled = styled.div`
  width: 450px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  border-left: 1px solid black;
  border-right: 1px solid black;
  font-size: 1rem;
  line-height: 1.8rem;
`;

export function Text() {
  const text = useTextStore((state) => state.text);

  return <TextStyled id="text">{text && <TextComponent />}</TextStyled>;
}
