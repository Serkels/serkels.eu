//

import { AppFooter } from ":components/shell/AppFooter.server";
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
