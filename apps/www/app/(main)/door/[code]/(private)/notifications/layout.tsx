//

import { TrpcRootProvider } from ":trpc/root";
import type { PropsWithChildren } from "react";

//

export default function Layout({ children }: PropsWithChildren) {
  return <TrpcRootProvider>{children}</TrpcRootProvider>;
}
