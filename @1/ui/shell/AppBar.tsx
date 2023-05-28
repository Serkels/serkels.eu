//

import type { PropsWithChildren } from "react";
import { Logo } from "../icons";

//

export function AppBar({ children }: PropsWithChildren) {
  return (
    <header className="flex px-[64px] bg-primary-gradient text-white justify-between items-stretch">
      <figure className="p-5">
        <Logo className="w-[133px] h-[22px] " />
      </figure>

      {children}
    </header>
  );
}
