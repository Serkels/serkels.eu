//

import { BigBar } from "@1/ui/shell";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import Image from "next/image";
import { AppFooter } from "./(index)/AppFooter";
import { HomeBanner } from "./(index)/HomeBanner";

//

export const revalidate: _1_HOUR_ = 3600;

export default async function Home() {
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

      <HomeBanner />

      {/* @ts-expect-error Server Component */}
      <AppFooter />
    </>
  );
}
