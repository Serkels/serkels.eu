//

import { Banner } from ":components/shell/Banner";
import type { PropsWithChildren } from "react";
import Motion_Layout from "./layout.client";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Banner className="col-span-full bg-black text-white">
      <main className="container mx-auto max-w-5xl">
        <Motion_Layout>{children}</Motion_Layout>
      </main>
    </Banner>
  );
}
