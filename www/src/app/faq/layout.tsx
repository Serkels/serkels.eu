///

import { AppFooter } from "@/components/AppFooter.server";
import { UserBar } from "@/components/UserBar";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UserBar />
      <div className="grid px-1 lg:grid-cols-12">{children}</div>;
      {/* @ts-expect-error Server Component */}
      <AppFooter />
    </>
  );
}
