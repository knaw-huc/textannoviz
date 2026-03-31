import { useContext } from "react";
import { AnnotatedTextConfig, AnnotatedTextContext } from "./AnnotatedText.tsx";

export function useAnnotatedTextConfig(): AnnotatedTextConfig {
  const context = useContext(AnnotatedTextContext);
  if (!context) {
    throw new Error("Missing AnnotatedTextProvider");
  }
  return context;
}
