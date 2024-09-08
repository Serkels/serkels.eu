//

import Analytics from ":components/shell/Analytics";
import { auth } from "@1.modules/auth.next/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { Roboto } from "next/font/google";
import { type PropsWithChildren } from "react";
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
  title: "Serkels",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Serkels",
    description: "Réseau d'échanges étudiant",
    url: new URL("https://toc-toc.org"),
  },
};

//

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${roboto.className} bg-[#F5F8FA] text-base text-black antialiased`}
      >
        <NextTopLoader color="#fff" showSpinner={false} />
        <SessionProvider session={session}>
          <RootProviders>{children}</RootProviders>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
