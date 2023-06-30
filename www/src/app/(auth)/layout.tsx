///

import { AppFooter } from "@/components/AppFooter.server";
import { BigBar } from "@1/ui/shell";
import Image from "next/image";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <BigBar>
        <Image
          src="/toc-toc.svg"
          alt="Toc Toc Logo"
          width={175}
          height={53}
          priority
        />
      </BigBar>
      <div className="col-auto grid grid-cols-12">{children}</div>
      <AppFooter />
    </div>
  );
}
