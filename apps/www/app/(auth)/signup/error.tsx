"use client";

import { Banner } from ":components/shell/Banner";
import { ErrorOccur } from "@1.ui/react/error";
import { Button } from "@1/ui/components/ButtonV";
import type { Metadata } from "next";

//

export const metadata: Metadata = {
  title: "401 _ Toc-Toc",
  description: "Looks like you knocked at the wrong door 👀.",
  icons: { icon: "/favicon.svg" },
};

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Banner className="flex-col justify-center">
      <ErrorOccur error={error} code="401" />
      <Button onPress={() => reset()}>Toquer de nouveau</Button>
    </Banner>
  );
}
