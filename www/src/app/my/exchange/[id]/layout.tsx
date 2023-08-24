///

import type { PropsWithChildren } from "react";
import { AsideNav } from "./AsideNav";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AsideNav />
      {children}
    </>
  );
}
