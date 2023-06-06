///

import { AppFooter } from "@/(index)/AppFooter";
import type { PropsWithChildren } from "react";
import { UserBar } from "../(index)/UserBar";

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
