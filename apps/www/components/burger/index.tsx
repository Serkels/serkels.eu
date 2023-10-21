"use client";

import { AppSidebar } from ":components/shell/AppSidebar";
import { HamburgerMenu } from "@1/ui/icons";
import { useToggle } from "@react-hookz/web";
import Link from "next/link";
import { tv } from "tailwind-variants";

//

export function MenuBurger({ className }: { className?: string }) {
  const [hidden, toggle] = useToggle(true);
  const { base, list, link } = menu_burger();
  return (
    <>
      <button className={base({ className })} onClick={toggle}>
        <HamburgerMenu />
      </button>
      <AppSidebar hidden={hidden} onClose={toggle}>
        <ul className={list()}>
          <li>
            <Link className={link()} href="/who" onClick={toggle}>
              Qui sommes-nous ?
            </Link>
          </li>
          <li>
            <Link className={link()} href="/legal" onClick={toggle}>
              Politique d'utilisation
            </Link>
          </li>
          <li>
            <Link className={link()} href="/faq" onClick={toggle}>
              FAQ
            </Link>
          </li>
        </ul>
      </AppSidebar>
    </>
  );
}

const menu_burger = tv({
  base: "absolute left-0 top-0 p-6",
  slots: {
    list: "",
    link: "block p-4 text-center text-lg hover:bg-gray-100 ",
  },
});
