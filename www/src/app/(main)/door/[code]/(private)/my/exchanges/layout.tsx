//

import type { PropsWithChildren } from "react";
import { EchangeNav } from "./EchangeNav";
import { Exchange_Aside_Nav } from "./layout.client";

//

export default function Layout({ children }: PropsWithChildren<any>) {
  return (
    <>
      <Exchange_Aside_Nav>
        <EchangeNav />
      </Exchange_Aside_Nav>
      {children}
    </>
  );
}
