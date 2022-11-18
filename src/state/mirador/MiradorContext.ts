import React from "react";
import { MiradorAction } from "./MiradorActions";
import { initMiradorState, MiradorState } from "./MiradorReducer";

interface MiradorContext {
  miradorState: MiradorState;
  miradorDispatch: React.Dispatch<MiradorAction>;
}

const initMiradorContext: MiradorContext = {
  miradorState: initMiradorState,
  miradorDispatch: null,
};

export const miradorContext =
  React.createContext<MiradorContext>(initMiradorContext);
