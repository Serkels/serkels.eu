//

import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { getInjector } from "~/core/di";
import Providers from "./(index)/Providers";
import "./globals.css";

const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://toc-toc.org"),
  title: "Toc-Toc",
  description: "Réseau d'échanges étudiant",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: PropsWithChildren) {
  console.log("< src/app/layout.tsx");

  // waiting_list.push(
  //   new Promise(async (resolve) => {
  //     console.log("< src/app/layout.tsx", "resolved!");
  //     resolve();
  //   }),
  // );

  // console.log({ waiting_list: waiting_list.length });
  // console.log("src/app/layout.tsx ready ?");
  await getInjector().ready();
  console.log("</ src/app/layout.tsx");

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

        <Script
          src={`/stalker.js?id=${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = [];
            function gtag(){dataLayer.push(arguments);}

            gtag('js', new Date());

            gtag('config', '${process.env["NEXT_PUBLIC_GA_MEASUREMENT_ID"]}', {
                page_path: window.location.pathname,
                transport_url: window.location.origin + '/api/stalker',
                first_party_collection: true,
            });
          `,
          }}
        />
      </body>
    </html>
  );
}
