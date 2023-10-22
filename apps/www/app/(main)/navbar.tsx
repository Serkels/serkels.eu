//

import { MenuBurger } from ":components/burger";
import { MobileNavBar } from ":components/shell/MobileNavBar";
import { getServerSession } from "@1.modules/auth.next";
import { Avatar } from "@1.modules/profile.ui";
import { Grid } from "@1.ui/react/grid";
import { Logo } from "@1.ui/react/icons";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

//

export default function UserBar() {
  return (
    <header className="sticky top-0 z-50 shadow-[0_3px_6px_#00000029]">
      <MenuBurger className="text-white" />

      <Grid className="items-center bg-primary-gradient-74 text-white sm:grid-cols-[repeat(3,_auto)]">
        <figure
          className="
            col-span-3
            flex
            h-16
            items-center
            sm:col-auto
            md:col-span-2
            xl:col-span-3
          "
        >
          <Link href="/">
            <Logo className="ml-12 w-[110px]" />
          </Link>
        </figure>

        <MobileNavBar
          className="
            fixed bottom-0 left-0 right-0 z-50 h-16
            sm:relative
            sm:z-auto sm:col-auto sm:h-full
            md:col-span-4
            xl:col-span-6
            sm:[&>ul]:w-full
            lg:[&>ul]:w-auto
          "
        />

        <UserNavGroup
          className="h-full md:col-span-2 xl:col-span-3"
          // title="ml-auto hidden max-w-[177px] sm:col-auto md:col-span-2 md:block xl:col-span-3"
        />
      </Grid>
    </header>
  );
}

async function UserNavGroup({ className }: ComponentPropsWithoutRef<"nav">) {
  const session = await getServerSession();
  const { base } = user_nav_group_variants({
    size: {
      initial: "xsmall",
      md: "medium",
      sm: "xsmall",
    },
  });
  if (!session) return null;
  return (
    <nav className={base({ className })}>
      <Link href={`/@~`} className="flex">
        <VisuallyHidden>Moi</VisuallyHidden>
        <Avatar
          className="h-7 w-7 border-2 border-white"
          profile={session.profile}
        />
      </Link>
    </nav>
  );
}

const user_nav_group_variants = tv(
  {
    base: ["flex items-center justify-end"], //["grid grid-cols-5 items-center justify-items-center"],
    variants: {
      size: {
        xsmall: ["block"],
        medium: ["block"],
      },
    },
    slots: {
      list: "",
    },
  },
  {
    responsiveVariants: ["sm", "md"],
  },
);
