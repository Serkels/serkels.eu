///

import { AppFooter } from "@/(index)/AppFooter";
import { BigBar } from "@1/ui/shell";
import Image from "next/image";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <BigBar>
        <Image
          src="/toc-toc.svg"
          alt="Toc Toc Logo"
          width={175}
          height={53}
          priority
        />
      </BigBar>
      <div className="grid px-1 lg:grid-cols-12">{children}</div>;
      {/* @ts-expect-error Server Component */}
      <AppFooter />
    </>
  );
}
