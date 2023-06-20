///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UserBar />
      <div
        className={`
          mx-auto
          grid
          h-screen
          grid-cols-4
          gap-4
          px-4
          sm:grid-cols-6
          sm:px-8
          md:grid-cols-8
          md:gap-6
          md:px-6
          lg:grid-cols-12
    `}
      >
        {children}
      </div>
      <AppFooter />
    </>
  );
}
