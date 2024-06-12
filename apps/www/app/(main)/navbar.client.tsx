"use client";

import { useToggle } from "@react-hookz/web";
import { createContext, type PropsWithChildren, type ReactNode } from "react";

//
export function UserMenuToggle({
  children,
  button,
}: PropsWithChildren<{ button: ReactNode }>) {
  const [isToggled, toggle] = useToggle(false);
  return (
    <>
      <button className="md:hidden" onClick={toggle}>
        {button}
      </button>

      <div>{isToggled && children}</div>
    </>
  );
}

export const context = createContext(
  {} as {
    close: boolean;
    toggle: () => void;
  },
);
