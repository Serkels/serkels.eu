//

import { MenuBurger } from ":components/burger";
import { Notification_DotIndicator } from ":components/navbar/notification_indicator.client";
import { MobileNavBar } from ":components/shell/MobileNavBar";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { Avatar } from "@1.modules/profile.ui";
import { Grid } from "@1.ui/react/grid";
import { Bell, Exchange, Logo, Messenger, Plus } from "@1.ui/react/icons";
import { VisuallyHidden } from "@1.ui/react/visually_hidden";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";

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
  const { base, icon } = user_nav_group_variants({
    size: {
      initial: "xsmall",
      md: "medium",
      sm: "xsmall",
    },
  });
  if (!session) return null;

  return match(session.profile.role)
    .with(PROFILE_ROLES.Enum.ADMIN, () => (
      <nav className={base({ className })}>
        <Link href={`/@~`} className="flex">
          <VisuallyHidden>Moi</VisuallyHidden>
          <Avatar
            className="size-7 border-2 border-white"
            profile={session.profile}
          />
        </Link>
      </nav>
    ))
    .with(PROFILE_ROLES.Enum.PARTNER, () => (
      <nav className={base({ className })}>
        <Link href={`/@~/opportunities/new`} className="flex">
          <VisuallyHidden>Créer une opportunité</VisuallyHidden>
          <Plus className={icon({ className: "bg-transparent p-0.5" })} />
        </Link>

        <Link href={`/@~`} className="flex">
          <VisuallyHidden>Moi</VisuallyHidden>
          <Avatar
            className="size-7 border-2 border-white"
            profile={session.profile}
          />
        </Link>
      </nav>
    ))
    .with(PROFILE_ROLES.Enum.STUDIENT, () => (
      <nav className={base({ className })}>
        <Link href={`/@~/notifications`} className="relative flex">
          <VisuallyHidden>Notifications</VisuallyHidden>
          <Bell className={icon()} />
          <Notification_DotIndicator />
        </Link>
        <Link href={`/@~/inbox`} className="flex">
          <VisuallyHidden>Messages</VisuallyHidden>
          <Messenger className={icon()} />
        </Link>
        <Link href={`/@~/exchanges/inbox`} className="flex">
          <VisuallyHidden>Mes échanges</VisuallyHidden>
          <Exchange className={icon()} />
        </Link>
        <Link href={`/@~`} className="flex">
          <VisuallyHidden>Moi</VisuallyHidden>
          <Avatar
            className="size-7 border-2 border-white"
            profile={session.profile}
          />
        </Link>
      </nav>
    ))
    .exhaustive();
}

const user_nav_group_variants = tv(
  {
    base: "flex items-center justify-end space-x-3",
    variants: {
      size: {
        xsmall: ["block"],
        medium: ["block"],
      },
    },
    slots: {
      list: "",
      icon: "box-border size-7 rounded-full bg-white/20 p-1.5",
    },
  },
  {
    responsiveVariants: ["sm", "md"],
  },
);
