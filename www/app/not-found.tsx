// "use client";

//

import { BigBar, Footer } from "@1/ui/shell";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

//

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
    <main
      className={`
        flex flex-col items-center justify-between
        bg-primary-gradient
        p-24`}
    >
      <h1
        className={`
            mx-auto
            my-0
            p-24
            text-center text-6xl
            font-extrabold
            text-white
            sm:text-7xl
            lg:text-8xl
        `}
      >
        {children}
      </h1>
    </main>
  );
}

async function getServerDate() {
  return new Date().toISOString();
}
