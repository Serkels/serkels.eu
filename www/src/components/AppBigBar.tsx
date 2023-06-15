"use client";

import { AppSidebar } from "@/app/(index)/AppSidebar";
import { HamburgerMenu } from "@1/ui/icons";
import { BigBar } from "@1/ui/shell";
import Image from "next/image";
import { useState } from "react";

//

export function AppBigBar() {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      <AppSidebar hidden={!showSideBar} onClose={() => setShowSideBar(false)} />
      <BigBar>
        <button
          className="absolute left-0 top-0 p-6"
          onClick={() => setShowSideBar(true)}
        >
          <HamburgerMenu />
        </button>

        <Image
          src="/toc-toc.svg"
          alt="Toc Toc Logo"
          width={175}
          height={53}
          priority
        />
      </BigBar>
    </>
  );
}
