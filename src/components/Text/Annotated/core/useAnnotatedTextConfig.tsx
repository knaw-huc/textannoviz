import { useContext } from "react";
import {
  AnnotatedTextComponents,
  AnnotatedTextContext,
} from "./AnnotatedText.tsx";

export function useAnnotatedTextConfig(): AnnotatedTextComponents {
  const context = useContext(AnnotatedTextContext);
  if (!context) {
    throw new Error("Missing AnnotatedTextProvider");
  }
  return context;
}
