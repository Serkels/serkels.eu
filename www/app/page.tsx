//

import { BigBar, Footer } from "@1/ui/shell";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import Image from "next/image";
import { HomeBanner } from "./(index)/HomeBanner";

//

export const revalidate: _1_HOUR_ = 3600;

async function getServerDate() {
  return new Date().toISOString();
}

export default async function Home() {
  const now = await getServerDate();

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

      <Footer now={now} />
    </>
  );
}
