///

import clsx from "clsx";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import Providers from "./(index)/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "bg-[#F5F8FA]")}>
        <NextTopLoader color="#fff" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
