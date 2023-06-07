//

import type { PropsWithChildren } from "react";
import { HamburgerMenu, Logo } from "../icons";

//

export function AppBar({ children }: PropsWithChildren) {
  return (
    <header
      className={`
        sticky
        top-0 z-50
        grid
        grid-cols-12
        items-stretch
        gap-[35px]
        bg-primary-gradient
        text-white

      `}
    >
      <figure className="col-span-3 flex items-center md:pl-[64px] ">
        <HamburgerMenu className="mr-5" />
        <Logo className="h-[22px] w-[133px]" />
      </figure>

      {children}
    </header>
  );
}
