//

import { AppFooter } from ":components/AppFooter.server";
import { Grid } from "@1/ui/components/Grid";
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
      {/* <UserBar /> */}

      <Grid className="min-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]">
        {children}
      </Grid>
      <AppFooter />
    </div>
  );
}

//

const style = tv({
  base: ["grid", "min-h-screen", "grid-rows-[max-content_1fr_max-content]"],
  slots: {
    header: [
      "sticky",
      "top-0",
      "z-50",
      "bg-primary-gradient-74",
      "text-white",
      "shadow-[0_3px_6px_#00000029]",
    ],
  },
});
