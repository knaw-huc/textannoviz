import React from "react";
import { BroccoliText } from "../../model/Broccoli";
import {
  SetText,
  SetTextToHighlight,
  TextAction,
  TEXT_ACTIONS,
} from "./TextActions";

export interface TextState {
  text: BroccoliText;
  textToHighlight: BroccoliText;
}

export const initTextState: TextState = {
  text: null,
  textToHighlight: null,
};

export const useTextState = (): [TextState, React.Dispatch<TextAction>] => {
  const [state, dispatch] = React.useReducer(textReducer, initTextState);

  return [state, dispatch];
};

const textReducer = (state: TextState, action: TextAction): TextState => {
  console.log(action, state);

  switch (action.type) {
    case TEXT_ACTIONS.SET_TEXT:
      return setText(state, action);
    case TEXT_ACTIONS.SET_TEXTTOHIGHLIGHT:
      return setTextToHighlight(state, action);
    default:
      break;
  }

  return state;
};

const setText = (state: TextState, action: SetText) => {
  return {
    ...state,
    text: action.text,
  };
};

const setTextToHighlight = (state: TextState, action: SetTextToHighlight) => {
  return {
    ...state,
    textToHighlight: action.textToHighlight,
  };
};
