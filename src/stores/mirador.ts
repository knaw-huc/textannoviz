import { create, StateCreator } from "zustand";

/**
 * Store created by and internally used by mirador
 * Textannoviz uses this store to catch and handle user events
 */
type MiradorStore = StoreSlice;

export type StoreSlice = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  miradorStore: any;
  setStore: (newStore: StoreSlice["miradorStore"]) => void;
};

const createStoreSlice: StateCreator<MiradorStore, [], [], StoreSlice> = (
  set,
) => ({
  miradorStore: null,
  setStore: (newStore) => set(() => ({ miradorStore: newStore })),
});

export const useMiradorStore = create<MiradorStore>()((...a) => ({
  ...createStoreSlice(...a),
}));
