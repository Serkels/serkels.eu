//

import { useCallback, type PropsWithChildren } from "react";
import { HamburgerMenu, Logo } from "../icons";

//

export function AppBar({
  children,
  onClick,
}: PropsWithChildren<{ onClick?: () => void }>) {
  const onBurgerClick = useCallback(() => onClick && onClick(), [onClick]);

  return (
    <header
      className={`
        sticky
        top-0
        z-50
        grid
        grid-cols-4
        items-stretch
        gap-4
        bg-primary-gradient
        px-4
        text-white
        shadow-[0_3px_6px_#00000029]
        sm:grid-cols-6
        sm:px-8
        md:grid-cols-8
        md:gap-6
        md:px-6
        lg:grid-cols-12
      `}
    >
      <figure className="col-span-2 flex h-14 items-center">
        <button className="mr-[14px]" onClick={onBurgerClick}>
          <HamburgerMenu className="h-[14px] w-[14px]" />
        </button>
        <span>
          <Logo className="w-[110px]" />
        </span>
      </figure>

      {children}
    </header>
  );
}
