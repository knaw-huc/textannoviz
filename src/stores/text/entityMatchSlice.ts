import { StateCreator } from "zustand";
import { EntityMatchTarget } from "../../components/Text/Annotated/utils/resolveEntityMatchTarget";

export type EntityMatchSlice = {
  entityMatchTarget: EntityMatchTarget | null;
  setEntityMatchTarget: (target: EntityMatchTarget) => void;
  resetEntityMatchTarget: () => void;
};

export const createEntityMatchSlice: StateCreator<
  EntityMatchSlice,
  [],
  [],
  EntityMatchSlice
> = (set) => ({
  entityMatchTarget: null,

  setEntityMatchTarget: (target) => {
    set(() => ({ entityMatchTarget: target }));
  },

  resetEntityMatchTarget() {
    set(() => ({ entityMatchTarget: null }));
  },
});
