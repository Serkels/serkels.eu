///

import clsx from "clsx";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import Providers from "./(index)/Providers";
import "./globals.css";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    // <html lang="en" className="text-[14px]">
    <html lang="en">
      <body
        className={clsx(
          roboto.className,
          "antialiased",
          "bg-[#F5F8FA]",
          "text-base"
        )}
      >
        <NextTopLoader color="#fff" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
