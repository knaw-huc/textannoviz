import { ComponentType } from "react";

/**
 * Log components resulting in the selected DOM element
 * - select element in browser Inspector
 * - call getComponents($0)
 */
export function getComponents(el: Element): Component[] {
  const entry = Object.entries(el).find(([k]) => k.startsWith("__reactFiber$"));
  const components: Component[] = [];
  let fiber = entry?.[1] as Fiber | null;

  while (fiber) {
    if (typeof fiber.type === "function") {
      const componentType = fiber.type as ComponentType;
      const state: unknown[] = [];

      let hook = fiber.memoizedState;
      while (hook) {
        if (hook.queue) {
          state.push(hook.memoizedState);
        }
        hook = hook.next;
      }

      components.push({
        name: componentType.displayName || componentType.name || "Anonymous",
        props: { ...fiber.memoizedProps },
        state,
      });
    }

    fiber = fiber.return;
  }

  return components;
}

type Component = {
  name: string;
  props: Record<string, unknown>;
  state: unknown[];
};

type Fiber = {
  type: ComponentType | string | null;
  memoizedProps: Record<string, unknown>;
  memoizedState: Hook | null;
  return: Fiber | null;
};

type Hook = {
  memoizedState: unknown;
  queue: unknown;
  next: Hook | null;
};

export const debugAnnotatedText = {
  getComponents,
};
