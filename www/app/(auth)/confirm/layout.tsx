//

import { Banner } from "@1/ui/shell";
import type { PropsWithChildren } from "react";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Banner className="col-span-full bg-black text-white">
      <main className="container mx-auto max-w-5xl">{children}</main>
    </Banner>
  );
}
