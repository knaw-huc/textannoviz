import React from "react";
import styled from "styled-components";
import { BroccoliText } from "../../model/Broccoli";
import { TextComponent } from "./TextComponent";

interface TextProps {
  text: BroccoliText;
}

const TextStyled = styled.div`
  min-width: 350px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  border-left: 1px solid black;
  border-right: 1px solid black;
  font-size: 1rem;
  line-height: 2.25rem;
`;

export function Text(props: TextProps) {
  return (
    <TextStyled id="text">
      {props.text && <TextComponent text={props.text} />}
    </TextStyled>
  );
}
