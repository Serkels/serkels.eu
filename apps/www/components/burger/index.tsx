"use client";

import { link } from "@1.ui/react/link/atom";
import { HamburgerMenu } from "@1/ui/icons";
import { useState } from "react";
import { tv } from "tailwind-variants";
import { AppSidebar } from "~/app/(index)/AppSidebar";

//

export function MenuBurger({ className }: { className?: string }) {
  const [showSideBar, setShowSideBar] = useState(false);
  const base = menu_burger({ className });
  return (
    <>
      <button className={base} onClick={() => setShowSideBar(true)}>
        <HamburgerMenu />
      </button>
      <AppSidebar hidden={!showSideBar} onClose={() => setShowSideBar(false)}>
        <ul>
          <li>
            <a className={link()} href="/legal">
              Mentions légales
            </a>
          </li>
          <li>
            <a className={link()} href="/about">
              À propos
            </a>
          </li>
        </ul>
      </AppSidebar>
    </>
  );
}

const menu_burger = tv({ base: "absolute left-0 top-0 p-6" });
