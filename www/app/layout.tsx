///

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
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
      <body className={inter.className}>
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
