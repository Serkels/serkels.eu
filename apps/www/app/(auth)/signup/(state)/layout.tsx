//

import { Banner } from ":components/shell/Banner";
import { Frame } from "@1.ui/react/motion/Frame";
import type { PropsWithChildren } from "react";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Banner className="col-span-full bg-black text-white">
      <main className="container mx-auto max-w-5xl">
        <Frame>{children}</Frame>
      </main>
    </Banner>
  );
}
