"use client";

import { Error_Layout } from ":components/Error_Layout";
import { BigBar } from ":components/shell/BigBar";
import SerkelsLogo from ":components/shell/SerkelsLogo";
import { ErrorOccur } from "@1.ui/react/error";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

//
export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className={`bg-[#F5F8FA] text-base text-black antialiased`}>
        <main className="flex min-h-screen flex-col">
          <BigBar>
            <Link href="/">
              <SerkelsLogo />
            </Link>
          </BigBar>

          <div className="flex-grow">
            <Error_Layout className="min-h-[100dvh]">
              <ErrorOccur
                error={error}
                debug={process.env.NODE_ENV === "development"}
              />
            </Error_Layout>
          </div>
        </main>
      </body>
    </html>
  );
}
