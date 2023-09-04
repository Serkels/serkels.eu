//

import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import Providers from "./(index)/Providers";
import "./globals.css";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://toc-toc.org"),
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: PropsWithChildren) {
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
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
