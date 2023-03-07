import React from "react";
import styled from "styled-components";
import { BroccoliTextV3 } from "../../model/Broccoli";
import { TextComponent } from "./TextComponent";

interface TextProps {
  text: BroccoliTextV3;
}

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

export function Text(props: TextProps) {
  return (
    <TextStyled id="text">
      {props.text && <TextComponent text={props.text} />}
    </TextStyled>
  );
}
