///

import { AppFooter } from "@/(index)/AppFooter";
import { UserBar } from "@/(index)/UserBar";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] lg:grid-cols-1">
      <div className="col-span-1">
        <UserBar />
      </div>
      <div className="col-span-1 bg-primary-gradient-large text-white">
        {children};
      </div>
      <div className="col-span-1">
        {/* @ts-expect-error Server Component */}
        <AppFooter />
      </div>
    </div>
  );
}
