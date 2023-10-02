//

import Analytics from ":components/Analytics";
import { OpenAPI_Repository } from "@1/core";
import { NextTsyringe, root_container } from "@1/next-tsyringe";
import clsx from "clsx";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Roboto } from "next/font/google";
import { cache, type PropsWithChildren } from "react";
import { fromServer } from "./api/v1";
import "./globals.css";
import { RootProviders } from "./layout.client";

//

const NextTopLoader = dynamic(() => import(":components/TopLoader"), {
  ssr: false,
});

//

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

//

export const metadata: Metadata = {
  metadataBase: new URL("https://toc-toc.org"),
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

//

@NextTsyringe.module({
  root_container: cache(() => root_container)(),
  scope: "server-only",
})
export class Root_Module {
  static Provider = RootLayout;
  static async register() {
    return [
      {
        token: OpenAPI_Repository.TOKEN.CLIENT,
        useValue: fromServer,
      },
    ];
  }
}

export default Root_Module.Provider;

//

export async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body
        className={clsx(
          roboto.className,
          "antialiased",
          "bg-[#F5F8FA]",
          "text-base",
        )}
      >
        <NextTopLoader color="#fff" showSpinner={false} />

        <RootProviders>{children}</RootProviders>

        <Analytics />
      </body>
    </html>
  );
}
