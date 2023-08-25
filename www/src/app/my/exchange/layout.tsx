///

import type { PropsWithChildren } from "react";
import { AsideNav } from "./AsideNav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AsideNav className="-ml-8 shadow-[15px_0px_15px_#00000014]"></AsideNav>
      {children}
    </>
  );
}
