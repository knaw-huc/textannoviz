import { createContext, useContext } from "react";
import { GroupedSegments } from "../AnnotationModel.ts";

const GroupContext = createContext<GroupedSegments | undefined>(undefined);

export const GroupProvider = GroupContext.Provider;

export function useGroup(): GroupedSegments | undefined {
  return useContext(GroupContext);
}
