//

import type { PropsWithChildren } from "react";
import { Foo } from "./layout.client";

//

export default async function Layout({ children }: PropsWithChildren) {
  return <Foo>{children}</Foo>;
}
