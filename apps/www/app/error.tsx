"use client";

import { Error_Layout } from ":components/Error_Layout";
import { MenuBurger } from ":components/burger";
import { BigBar } from ":components/shell/BigBar";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import { useMountEffect } from "@react-hookz/web";
import { signOut } from "next-auth/react";
import dynamic from "next/dynamic";
import Link from "next/link";

//

const SerkelsLogo = dynamic(() => import(":components/shell/SerkelsLogo"), {
  ssr: false,
  loading() {
    return <VisuallyHidden>Serkels</VisuallyHidden>;
  },
});

//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useMountEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    signOut();
  });
  return (
    <main className="flex min-h-screen flex-col">
      <BigBar>
        <MenuBurger />
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
          <Button onPress={() => reset()}>Toquer de nouveau</Button>
        </Error_Layout>
      </div>
    </main>
  );
}
