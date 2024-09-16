// "use client";

//

import { AppFooter } from ":components/shell/AppFooter.server";
import { Banner } from ":components/shell/Banner";
import { BigBar } from ":components/shell/BigBar";
import SerkelsLogo from ":components/shell/SerkelsLogo";
import type { Metadata } from "next";
import Link from "next/link";
import type { PropsWithChildren } from "react";

//

export const metadata: Metadata = {
  title: "404 _ Serkels",
  description: "Looks like you knocked at the wrong door 👀.",
  icons: { icon: "/favicon.svg" },
};

export default async function Page() {
  return (
    <div className="grid min-h-screen grid-rows-[max-content_1fr_max-content]">
      <BigBar>
        <Link href="/">
          <SerkelsLogo />
        </Link>
      </BigBar>
      <NotFoundMain>404</NotFoundMain>
      <AppFooter />
    </div>
  );
}

//

export function NotFound() {
  return (
    <div className="col-span-full h-full">
      <NotFoundMain>404</NotFoundMain>
    </div>
  );
}

export function NotFoundMain({ children }: PropsWithChildren) {
  return (
    <Banner className="h-full">
      <main
        className={`mx-auto my-0 text-center text-6xl font-extrabold text-white sm:text-7xl lg:text-8xl`}
      >
        {children}
      </main>
    </Banner>
  );
}
