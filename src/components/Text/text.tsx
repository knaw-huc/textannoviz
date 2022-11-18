import React from "react";
import styled from "styled-components";
import { textContext } from "../../state/text/TextContext";
//import { Loading } from "../backend/utils/Loader"
import { TextComponent } from "./TextComponent";
//import { TextHighlighting } from "./TextHighlighting"
// import { fetchJson } from "../backend/utils/fetchJson"
// import { ACTIONS } from "../state/actions"

const TextStyled = styled.div`
  min-width: 300px;
  height: 800px;
  padding: 0.7em;
  overflow: auto;
  white-space: pre-wrap;
  border-left: 1px solid black;
  border-right: 1px solid black;
  font-size: 1rem;
  line-height: 2.25rem;
  mark {
    background-color: #ffc04b;
  }
`;

export function Text() {
  const { textState } = React.useContext(textContext);

  return (
    <TextStyled id="text">
      {/* {state.MirAnn ? <TextComponent /> : <Loading />} */}
      {/* <TextComponent /> */}
      {/* {state.annItemOpen ? <TextHighlighting /> : <TextComponent />} */}
      {textState.text && <TextComponent />}
    </TextStyled>
  );
}
