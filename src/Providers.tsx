import React from "react";
import { miradorContext } from "./state/mirador/MiradorContext";
import { useMiradorState } from "./state/mirador/MiradorReducer";

export const Providers = (props: { children: React.ReactNode }) => {
  const [miradorState, miradorDispatch] = useMiradorState();

  return (
    <miradorContext.Provider value={{ miradorState, miradorDispatch }}>
      {props.children}
    </miradorContext.Provider>
  );
};
