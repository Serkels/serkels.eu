// "use client";

//

import { Banner, BigBar, Footer } from "@1/ui/shell";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

//

export const metadata: Metadata = {
  title: "404 _ Toc-Toc",
  description: "Looks like you knocked at the wrong door 👀.",
  icons: { icon: "/favicon.svg" },
};

export default async function NotFound() {
  const now = await getServerDate();
  return (
    <>
      <BigBar>
        <Link href="/">
          <Image
            src="/toc-toc.svg"
            alt="Toc Toc Logo"
            width={175}
            height={53}
            priority
          />
        </Link>
      </BigBar>
      <NotFoundMain>404</NotFoundMain>
      <Footer now={now} />
    </>
  );
}

//

function NotFoundMain({ children }: PropsWithChildren) {
  return (
    <Banner>
      <main
        className={`
            mx-auto
            my-0
            text-center text-6xl
            font-extrabold
            text-white
            sm:text-7xl
            lg:text-8xl
        `}
      >
        {children}
      </main>
    </Banner>
  );
}

async function getServerDate() {
  return new Date().toISOString();
}
