///

import { AppFooter } from "@/components/AppFooter.server";
import type { PropsWithChildren } from "react";
import { UserBar } from "@/components/UserBar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UserBar />
      {children}
      {/* @ts-expect-error Server Component */}
      <AppFooter />
    </>
  );
}
