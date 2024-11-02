"use client";

import { Error_Layout } from ":components/Error_Layout";
import { BigBar } from ":components/shell/BigBar";
import SerkelsLogo from ":components/shell/SerkelsLogo";
import { Button } from "@1.ui/react/button";
import { ErrorOccur } from "@1.ui/react/error";
import { useMountEffect } from "@react-hookz/web";
import Link from "next/link";
import { useRouter } from "next/navigation";

//

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { replace } = useRouter();
  useMountEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    replace("/logout");
  });
  return (
    <main className="flex min-h-screen flex-col">
      <BigBar>
        {/* <MenuBurger /> */}
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
