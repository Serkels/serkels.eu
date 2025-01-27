//

import { AppFooter } from ":components/shell/AppFooter.server";
import { MobileNavBar } from ":components/shell/MobileNavBar";
import { TermAgreement } from ":components/terms/TermAgreement";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import Header from "./navbar";

//

export default function Main_Layout({ children }: PropsWithChildren) {
  const { base, header } = style();
  return (
    <div className={base()}>
      <header className={header()}>
        <Header />
      </header>

      {children}
      <AppFooter />
      <MobileNavBar className="mobileNavbar sticky bottom-0 left-0 right-0 z-50 h-16 sm:z-auto sm:col-auto sm:h-full md:col-span-4 md:hidden xl:col-span-6 sm:[&>ul]:w-full lg:[&>ul]:w-auto" />
      <TermAgreement />
    </div>
  );
}

//

const style = tv({
  base: [
    "grid",
    "min-h-screen",
    "grid-rows-[max-content_1fr_max-content]",
    "[grid-template-areas:'header''main''mobileNav']",
  ],
  slots: {
    header: ["header", "sticky", "top-0", "z-50"],
  },
});
