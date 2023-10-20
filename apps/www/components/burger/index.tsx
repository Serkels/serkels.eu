"use client";

import { link } from "@1.ui/react/link/atom";
import { HamburgerMenu } from "@1/ui/icons";
import { useState } from "react";
import { AppSidebar } from "~/app/(index)/AppSidebar";

//

export function MenuBurger() {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      <button
        className="absolute left-0 top-0 p-6"
        onClick={() => setShowSideBar(true)}
      >
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
