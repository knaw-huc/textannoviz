export type ContextType<T> = {
    state: T;
    setState: (a: T) => void
  }