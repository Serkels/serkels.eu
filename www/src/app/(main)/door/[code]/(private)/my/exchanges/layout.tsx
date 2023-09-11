//

import type { PropsWithChildren } from "react";
import { EchangeNav, My_Echange_Nav } from "./EchangeNav";

//

export default function Layout({ children }: PropsWithChildren<any>) {
  return (
    <>
      <My_Echange_Nav>
        <EchangeNav />
      </My_Echange_Nav>
      {children}
    </>
  );
}
