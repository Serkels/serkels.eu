"use client";

import type { PropsWithChildren } from "react";
import { AsideBar } from "~/layouts/holy/aside";

//

export function My_Inbox_Nav({ children }: PropsWithChildren) {
  return (
    <AsideBar className="">
      {/* <AsideBar className="-ml-8 shadow-[15px_0px_15px_#00000014]"> */}
      <div className="sticky top-[calc(theme(spacing.14)_+_theme(spacing.9))]">
        {children}
      </div>
    </AsideBar>
  );
}
