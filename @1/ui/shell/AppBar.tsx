//

import type { PropsWithChildren } from "react";
import { Logo } from "../icons";

//

export function AppBar({ children }: PropsWithChildren) {
  return (
    <header
      className={
        "flex items-stretch justify-between bg-primary-gradient text-white md:px-[64px]"
      }
    >
      <figure className="p-5">
        <Logo className="h-[22px] w-[133px] " />
      </figure>

      {children}
    </header>
  );
}
