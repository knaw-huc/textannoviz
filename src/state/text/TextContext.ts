import React from "react";
import { TextAction } from "./TextActions";
import { initTextState, TextState } from "./TextReducer";

interface TextContext {
  textState: TextState;
  textDispatch: React.Dispatch<TextAction>;
}

const initTextContext: TextContext = {
  textState: initTextState,
  textDispatch: null,
};

export const textContext = React.createContext<TextContext>(initTextContext);
