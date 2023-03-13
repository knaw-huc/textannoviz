import { create, StateCreator } from "zustand";

export interface StoreSlice {
  miradorStore: any;
  setStore: (newStore: StoreSlice["miradorStore"]) => void;
}

export interface CurrentContextSlice {
  currentContext:
    | {
        tier0: string;
        tier1: string;
        bodyId: string;
      }
    | undefined;
  setCurrentContext: (
    newCurrentContext: CurrentContextSlice["currentContext"]
  ) => void;
}

export interface CanvasSlice {
  canvas:
    | {
        canvasIds: string[];
        currentIndex: number;
      }
    | undefined;
  setCanvas: (newCanvas: CanvasSlice["canvas"]) => void;
}

const createStoreSlice: StateCreator<
  StoreSlice & CurrentContextSlice & CanvasSlice,
  [],
  [],
  StoreSlice
> = (set) => ({
  miradorStore: null,
  setStore: (newStore) => set(() => ({ miradorStore: newStore })),
});

const createCurrentContextSlice: StateCreator<
  StoreSlice & CurrentContextSlice & CanvasSlice,
  [],
  [],
  CurrentContextSlice
> = (set) => ({
  currentContext: undefined,
  setCurrentContext: (newCurrentContext) =>
    set(() => ({ currentContext: newCurrentContext })),
});

const createCanvasSlice: StateCreator<
  StoreSlice & CurrentContextSlice & CanvasSlice,
  [],
  [],
  CanvasSlice
> = (set) => ({
  canvas: undefined,
  setCanvas: (newCanvas) => set(() => ({ canvas: newCanvas })),
});

export const useMiradorStore = create<
  StoreSlice & CurrentContextSlice & CanvasSlice
>()((...a) => ({
  ...createStoreSlice(...a),
  ...createCurrentContextSlice(...a),
  ...createCanvasSlice(...a),
}));
