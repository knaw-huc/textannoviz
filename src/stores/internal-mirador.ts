import { create, StateCreator } from "zustand";

/**
 * Store created by and internally used by mirador
 * Textannoviz uses this store to catch and handle user events
 */
type InternalMiradorStore = InternalStoreSlice;

export type InternalStoreSlice = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  miradorStore: any;
  setStore: (newStore: InternalStoreSlice["miradorStore"]) => void;
};

const createStoreSlice: StateCreator<
  InternalMiradorStore,
  [],
  [],
  InternalStoreSlice
> = (set) => ({
  miradorStore: null,
  setStore: (newStore) => set(() => ({ miradorStore: newStore })),
});

export const useInternalMiradorStore = create<InternalMiradorStore>()(
  (...a) => ({
    ...createStoreSlice(...a),
  }),
);
