//

import { MenuBurger } from ":components/burger";
import { Grid } from "@1.ui/react/grid";
import { Logo } from "@1/ui/icons";
import Link from "next/link";
import { MobileNavBar } from "~/components/MobileNavBar";

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
      </Grid>
    </header>
  );
}
