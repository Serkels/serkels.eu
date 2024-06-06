"use client";
import { useToggle } from "@react-hookz/web";
import { createContext, type PropsWithChildren } from "react";

//

export function Provider({ children }: PropsWithChildren) {
  const [isToggled, toggle] = useToggle(false);
  return (
    <context.Provider value={{ close: !isToggled, toggle }}>
      {children}
    </context.Provider>
  );
}
export const context = createContext(
  {} as {
    close: boolean;
    toggle: () => void;
  },
);
