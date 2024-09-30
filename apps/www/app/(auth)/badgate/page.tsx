//

import { Banner } from ":components/shell/Banner";
import { ErrorMessage } from ":widgets/auth/ErrorMessage";
import { ErrorOccur } from "@1.ui/react/error";
import type { Metadata } from "next";

//

export const metadata: Metadata = {
  title: "401 _ Serkels",
  description: "Looks like you knocked at the wrong door 👀.",
  icons: { icon: "/favicon.svg" },
};

export default function BadGate() {
  return (
    <Banner className="flex-col justify-center">
      <ErrorOccur error={new Error("Bad Gate")} code="401" />
      <ErrorMessage />
    </Banner>
  );
}
