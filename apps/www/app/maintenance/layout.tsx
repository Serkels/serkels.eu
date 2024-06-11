//

import { AppFooter } from ":components/shell/AppFooter.server";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

//

export default function Main_Layout({ children }: PropsWithChildren) {
  // const { base, header } = style();

  return (
    <div className={style()}>
      {children}

      <AppFooter />
    </div>
  );
}

//

const style = tv({
  base: ["grid", "min-h-screen", "grid-rows-[1fr_max-content]"],
});
