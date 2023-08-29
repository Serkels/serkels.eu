///

import type { PropsWithChildren } from "react";
import { AppFooter } from "~/components/AppFooter.server";
import { UserBar } from "~/components/UserBar";

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
        <AppFooter />
      </div>
    </div>
  );
}
