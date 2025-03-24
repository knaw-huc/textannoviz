import { create, StateCreator } from "zustand";

import { Iiif } from "../model/Broccoli";
import { Optional } from "../utils/Optional.ts";

export type MiradorSlice = {
  iiif: Iiif;
  bodyId: string;
  setStore: (update: MiradorState) => void;
};
export type MiradorInitSlice = Optional<MiradorSlice, "bodyId" | "iiif">;
export type MiradorState = Omit<MiradorSlice, "setStore">;

export type MiradorCurrentCanvasSlice = {
  currentCanvas: string;
  setCurrentCanvas: (newCanvas: string) => void;
};

type MiradorStore = MiradorInitSlice & MiradorCurrentCanvasSlice;

const createMiradorSlice: StateCreator<
  MiradorInitSlice,
  [],
  [],
  MiradorInitSlice
> = (set) => ({
  iiif: undefined,
  bodyId: undefined,
  setStore: (update) => set(() => ({ ...update })),
});

const createMiradorCurrentCanvasSlice: StateCreator<
  MiradorCurrentCanvasSlice,
  [],
  [],
  MiradorCurrentCanvasSlice
> = (set) => ({
  currentCanvas: "",
  setCurrentCanvas: (newCanvas) => set(() => ({ currentCanvas: newCanvas })),
});

export const useMiradorStore = create<MiradorStore>()((...a) => ({
  ...createMiradorSlice(...a),
  ...createMiradorCurrentCanvasSlice(...a),
}));

export function miradorSelector(state: MiradorInitSlice): MiradorSlice {
  if (!state.bodyId) {
    throw new Error("Mirador store not init");
  }
  return state as MiradorSlice;
}
