//

import { AppFooter } from ":components/AppFooter.server";
import { type PropsWithChildren } from "react";
import { tv } from "tailwind-variants";
import Header from "./header";

//

export default function MainLayout({ children }: PropsWithChildren) {
  const { base, header } = style();
  return (
    <div className={base()}>
      <header className={header()}>
        <Header />
      </header>

      {children}

      <AppFooter />
    </div>
  );
}

//

const style = tv({
  base: ["grid", "min-h-screen", "grid-rows-[max-content_1fr_max-content]"],
  slots: {
    header: ["sticky", "top-0", "z-50"],
  },
});
