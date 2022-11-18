import { TextState } from "./TextReducer";

export enum TEXT_ACTIONS {
  SET_TEXT = "SET_TEXT",
  SET_TEXTTOHIGHLIGHT = "SET_TEXTTOHIGHLIGHT",
}

export type SetText = Pick<TextState, "text"> & {
  type: TEXT_ACTIONS.SET_TEXT;
};

export type SetTextToHighlight = Pick<TextState, "textToHighlight"> & {
  type: TEXT_ACTIONS.SET_TEXTTOHIGHLIGHT;
};

export type TextAction = SetText | SetTextToHighlight;
